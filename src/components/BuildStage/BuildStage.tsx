import Konva from 'konva';
import { Button } from 'core';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Group, Layer, Line, Rect, Stage, Transformer } from 'react-konva';
import GoogleMapReact, { Coords } from 'google-map-react';
import styles from '../../css/BuildStage.module.css';
import useEventListener from '../useEventListener';
import Room from './Room';
import Background from './Background';
import { FixedMouseEvent, SubTool, Tool, Vector2 } from '../../Types';
import { AppInfoContext, BuildStageContext } from '../../Context';
import KonvaEventObject = Konva.KonvaEventObject;

export const BuildStage = ({ propertiesWindow, googleApiKey }: { propertiesWindow: boolean; googleApiKey: string }): JSX.Element => {
    const backgroundSize = { height: 600, width: 950 };

    const { selectedTool, cursor, spacing, map, setMap, selectedSubTool, selectedRoomName, setSelectedRoomName } = useContext(AppInfoContext);
    const stage = useRef<Konva.Stage>(null);
    const roomGroupRef = useRef<Konva.Group>(null);
    const ref = useRef<GoogleMapReact>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    const [mapRotation, setMapRotation] = useState(0);
    const [mapScale, setMapScale] = useState({ x: 1, y: 1 });
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [mapSelected, setMapSelected] = useState(false);
    const [googleInfo, setGoogleInfo] = useState({ lat: 51.5072, lng: 0.1276, zoom: 10 });
    const [dimensions, setDimensions] = useState([window.innerWidth - (propertiesWindow ? 580 : 80), window.innerHeight - 100]);
    const [backgroundPosition, setBackgroundPosition] = useState({
        x: dimensions[0] / 2 - backgroundSize.width / 2,
        y: dimensions[1] / 2 - backgroundSize.height / 2,
    });
    const [showMap, setShowMap] = useState(true);
    const [stageInfo, setStageInfo] = useState({
        stageScale: 1,
        stageX: 0,
        stageY: 0,
    });
    const [mousePressed, setMousePressed] = useState(false); // DOC is the mouse currently pressed
    const [mousePressedPosition, setMousePressedPosition] = useState<Vector2>(); // DOC the initial position the mouse was pressed for dragging
    const [mousePosition, setMousePosition] = useState<Vector2>({ x: 0, y: 0 }); // DOC the current position of the cursor
    const [selectionRegionPoints, setSelectionRegionPoints] = useState<Array<number>>();
    const [selectionRegionStatus, setSelectionRegionStatus] = useState(false); // true -- shown, false -- hidden

    const newDimensions = useCallback(() => setDimensions([window.innerWidth - (propertiesWindow ? 580 : 80), window.innerHeight - 100]), [
        propertiesWindow,
    ]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position =>
                setGoogleInfo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: googleInfo.zoom,
                }),
            () => setGoogleInfo({ lat: 51.5072, lng: 0.1276, zoom: googleInfo.zoom }),
        );
    });
    useEffect(() => newDimensions(), [newDimensions]);
    useEffect(() => {
        if (selectedSubTool === SubTool.AddDoor) {
            if (map.rooms.length === 1) return;
            const selectedRoomIndex = map.rooms.findIndex(room => room.name === selectedRoomName);
            const tempRoomList = map.rooms.splice(selectedRoomIndex, 1);
            setMap({
                ...map,
                rooms: [map.rooms[selectedRoomIndex], ...tempRoomList],
            });
        }
    }, [map, selectedRoomName, selectedSubTool, setMap]);
    useEffect(() => {
        if (!roomGroupRef?.current) return;
        if (selectedTool !== Tool.Position) {
            roomGroupRef?.current.position({ x: 0, y: 0 });
            return;
        }
        roomGroupRef?.current.position(mapPosition);
    }, [mapPosition, selectedTool]);
    useEffect(() => {
        if (selectedTool !== Tool.Position) {
            setMapSelected(false);
        }
    }, [selectedTool]);
    useEventListener('resize', newDimensions);
    useEffect(() => {
        if (!mapSelected || !transformerRef.current || !transformerRef.current.getLayer() || !roomGroupRef.current) return;
        transformerRef.current.nodes([roomGroupRef.current]);
        const layer = transformerRef.current.getLayer();
        if (!layer) return;
        layer.batchDraw();
    }, [mapSelected]);
    const getWorldPosition = useCallback(
        (point: Vector2): Coords | void => {
            if (!ref.current || !stage?.current) return;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { map_: curMap } = ref.current;
            if (!curMap) return;

            const topRight = curMap.getProjection().fromLatLngToPoint(curMap.getBounds().getNorthEast());
            const bottomLeft = curMap.getProjection().fromLatLngToPoint(curMap.getBounds().getSouthWest());
            const scale = 2 ** curMap.getZoom();

            const coordPoint = new google.maps.Point(
                (point.x + stageInfo.stageX) / scale + bottomLeft.x,
                (point.y + stageInfo.stageY) / scale + topRight.y,
            );
            const projection = curMap.getProjection().fromPointToLatLng(coordPoint);
            // eslint-disable-next-line consistent-return
            return { lat: projection.lat(), lng: projection.lng() };
        },
        [stageInfo.stageX, stageInfo.stageY],
    );
    useEffect(() => {
        if (selectedTool !== Tool.Position || !stage.current || map.rooms.length === 0) return;
        const room = stage.current.find(`.${map.rooms[0].name}-Fill`);
        if (!room || room.length === 0) return;
        const mapPos = room[0].absolutePosition();
        const projection = getWorldPosition({ x: mapPos.x, y: mapPos.y });
        const widthRationProjection = getWorldPosition({
            x: room[0].width() + mapPos.x,
            y: mapPos.y,
        });
        const heightRationProjection = getWorldPosition({
            x: mapPos.x,
            y: room[0].height() + mapPos.y,
        });
        if (!projection || !widthRationProjection || !heightRationProjection) return;
        setMap({
            position: {
                lat: projection.lat,
                lng: projection.lng,
            },
            ratios: {
                lat: (projection.lat - heightRationProjection.lat) / map.rooms[0].height,
                lng: (widthRationProjection.lng - projection.lng) / map.rooms[0].width,
            },
            rotation: mapRotation,
            scale: mapScale,
            rooms: map.rooms,
        });
    }, [getWorldPosition, map.rooms, mapScale, selectedTool, setMap, mapPosition, mapRotation]);
    useEventListener('keydown', e => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            setMap({
                ...map,
                rooms: map.rooms.filter(curMap => curMap.name !== selectedRoomName),
            });
            setSelectedRoomName(null);
        }
    });

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        if (selectedSubTool === SubTool.AddDoor || selectedTool === Tool.Position) return;
        if (e.evt.shiftKey) {
            const newPosition = e.evt.deltaY > 0 ? stageInfo.stageX + 30 : stageInfo.stageX - 30;
            setStageInfo({
                ...stageInfo,
                stageX: newPosition,
            });
        } else {
            const newPosition = e.evt.deltaY > 0 ? stageInfo.stageY - 30 : stageInfo.stageY + 30;
            setStageInfo({
                ...stageInfo,
                stageY: newPosition,
            });
        }
        // if (e.evt.ctrlKey) {
        //             e.evt.preventDefault();
        //             const scaleBy = 1.15;
        //             const stage = e.target.getStage();
        //             if (stage === null) return;
        //             const oldScale = stage.scaleX();
        //             const mousePointTo = {
        //                 x:
        //                     stage.getPointerPosition()!.x / oldScale -
        //                     stage.x() / oldScale,
        //                 y:
        //                     stage.getPointerPosition()!.y / oldScale -
        //                     stage.y() / oldScale,
        //             };
        //
        //             const newScale =
        //                 e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        //             if (newScale > 2 || newScale < 0.5) return;
        //             setStageInfo({
        //                 stageScale: newScale,
        //                 stageX:
        //                     -(
        //                         mousePointTo.x -
        //                         stage.getPointerPosition()!.x / newScale
        //                     ) * newScale,
        //                 stageY:
        //                     -(
        //                         mousePointTo.y -
        //                         stage.getPointerPosition()!.y / newScale
        //                     ) * newScale,
        //             });
        //         } else
    };
    const onMouseDown = (event: KonvaEventObject<FixedMouseEvent>) => {
        const { name } = event.currentTarget.attrs;
        if (name.includes('BACKGROUND') || name.includes('STAGE')) {
            switch (selectedTool) {
                case Tool.Cursor:
                case Tool.Add:
                    setMousePressed(true);
                    setMousePressedPosition({
                        x: event.evt.layerX - stageInfo.stageX,
                        y: event.evt.layerY - stageInfo.stageY,
                    });
                    break;
                default:
                    break;
            }
        }
        if (event.target === event.target.getStage() && selectedTool === Tool.Position) {
            setMapSelected(false);
        }
    };
    const onMouseUp = () => {
        setMousePressed(false);
        setSelectionRegionStatus(false);
        if (selectedTool === Tool.Add && mousePressedPosition) {
            const width = Math.round(Math.abs(mousePressedPosition.x - mousePosition.x) / spacing);
            const height = Math.round(Math.abs(mousePressedPosition.y - mousePosition.y) / spacing);
            const topLeftPosition = [
                mousePressedPosition,
                mousePosition,
                { x: mousePosition.x, y: mousePressedPosition.y },
                { x: mousePressedPosition.x, y: mousePosition.y },
            ]
                .sort((point1, point2) => point1.x - point2.x)
                .slice(0, 2)
                .sort((point1, point2) => point1.y - point2.y)[0];
            const position = {
                x: Math.round((topLeftPosition.x - backgroundPosition.x) / spacing) + 1,
                y: Math.round((topLeftPosition.y - backgroundPosition.y) / spacing) + 1,
            };
            const roomName = map.rooms.length === 0 ? `Room-0` : `Room-${parseInt(map.rooms[map.rooms.length - 1].name.split('-')[1], 10) + 1}`;
            setMap({
                ...map,
                rooms: [
                    ...map.rooms,
                    {
                        name: roomName,
                        doorPosition: null,
                        ...position,
                        height,
                        width,
                    },
                ],
            });
        }
        setMousePressedPosition(undefined);
    };
    const updateSelectionBox = () => {
        if (mousePressed && mousePressedPosition && mousePosition) {
            setSelectionRegionStatus(true);
            setSelectionRegionPoints([
                mousePressedPosition.x,
                mousePressedPosition.y,
                mousePressedPosition.x,
                mousePosition.y,
                mousePosition.x,
                mousePosition.y,
                mousePosition.x,
                mousePressedPosition.y,
            ]);
        }
    };
    const onMouseMove = (event: KonvaEventObject<FixedMouseEvent>) => {
        setMousePosition({
            x: event.evt.layerX - stageInfo.stageX,
            y: event.evt.layerY - stageInfo.stageY,
        });
        switch (selectedTool) {
            case Tool.Cursor:
            case Tool.Selector:
            case Tool.Add:
                updateSelectionBox();
                break;
            default:
                break;
        }
    };

    return (
        <AppInfoContext.Consumer key={'this-is-very-unique'}>
            {appInfo => (
                <div key={'buildStage'} className={styles.buildStage}>
                    {appInfo.selectedTool === Tool.Position && (
                        <div style={{ width: dimensions[0], height: dimensions[1], position: 'absolute' }}>
                            <Button className={styles.placeMapButton} onClick={() => setShowMap(!showMap)}>
                                {showMap ? 'Move Map Position' : 'Edit Map Positioning'}
                            </Button>
                            <GoogleMapReact
                                ref={ref}
                                options={{ fullscreenControl: false }}
                                yesIWantToUseGoogleMapApiInternals
                                defaultCenter={{ lat: googleInfo.lat, lng: googleInfo.lng }}
                                onDragEnd={e => setGoogleInfo({ lat: e.center.lat(), lng: e.center.lng(), zoom: e.zoom })}
                                onZoomAnimationEnd={e => setGoogleInfo({ ...googleInfo, zoom: e })}
                                defaultZoom={googleInfo.zoom}
                                bootstrapURLKeys={{ key: googleApiKey }}
                            />
                        </div>
                    )}
                    <div
                        className={styles.konvaCanvas}
                        style={{ cursor, pointerEvents: appInfo.selectedTool === Tool.Position && !showMap ? 'none' : 'auto' }}
                    >
                        <Stage
                            key={'STAGE'}
                            name={'STAGE'}
                            ref={stage}
                            x={stageInfo.stageX}
                            y={stageInfo.stageY}
                            width={dimensions[0]}
                            height={dimensions[1]}
                            scaleX={stageInfo.stageScale}
                            scaleY={stageInfo.stageScale}
                            onWheel={e => handleWheel(e)}
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                        >
                            <AppInfoContext.Provider value={appInfo}>
                                <BuildStageContext.Provider
                                    value={{
                                        backgroundPosition,
                                        setBackgroundPosition,
                                        backgroundSize,
                                        mousePosition,
                                    }}
                                >
                                    <Layer>
                                        {appInfo.selectedTool !== Tool.Position && (
                                            <Background
                                                height={backgroundSize.height}
                                                width={backgroundSize.width}
                                                onMouseMove={() => null}
                                                onMouseUp={() => null}
                                                screenWidth={dimensions[0]}
                                                screenHeight={dimensions[1]}
                                            />
                                        )}
                                    </Layer>
                                    <Layer>
                                        {showMap && mapSelected && (
                                            <Transformer
                                                ref={transformerRef}
                                                boundBoxFunc={(oldBox, newBox) => {
                                                    // limit resize
                                                    if (newBox.width < 5 || newBox.height < 5) {
                                                        return oldBox;
                                                    }
                                                    return newBox;
                                                }}
                                                onTransformEnd={({ target }) => {
                                                    setMapScale({ x: target.attrs.scaleX, y: target.attrs.scaleY });
                                                    setMapRotation(target.attrs.rotation);
                                                }}
                                            />
                                        )}
                                        {showMap && (
                                            <Group
                                                onClick={() => {
                                                    if (mapSelected || selectedTool !== Tool.Position) return;
                                                    setMapSelected(true);
                                                }}
                                                rotation={selectedTool === Tool.Position ? mapRotation : 0}
                                                scaleX={selectedTool === Tool.Position ? mapScale.x : 1}
                                                scaleY={selectedTool === Tool.Position ? mapScale.y : 1}
                                                x={mapPosition.x}
                                                y={mapPosition.y}
                                                ref={roomGroupRef}
                                                draggable={selectedTool === Tool.Position}
                                                onDragEnd={({ target: { attrs } }) => {
                                                    if (selectedTool !== Tool.Position) return;
                                                    setMapPosition({ x: attrs.x, y: attrs.y });
                                                }}
                                            >
                                                {appInfo.map.rooms.map((room, index) => {
                                                    return (
                                                        <Room
                                                            key={room.name}
                                                            index={index}
                                                            name={room.name}
                                                            x={room.x}
                                                            y={room.y}
                                                            width={room.width}
                                                            height={room.height}
                                                            doorPosition={room.doorPosition}
                                                        />
                                                    );
                                                })}
                                                {appInfo.map.rooms.flatMap(room => {
                                                    if (
                                                        !room.doorPosition ||
                                                        !room.doorRotation ||
                                                        !room.doorSize ||
                                                        (appInfo.selectedSubTool === SubTool.AddDoor && appInfo.selectedRoomName === room.name)
                                                    )
                                                        return null;
                                                    return (
                                                        <Rect
                                                            key={`DOOR-${room.name}`}
                                                            fill={'white'}
                                                            x={room.x * spacing + room.doorPosition.x}
                                                            y={room.y * spacing + room.doorPosition.y}
                                                            height={room.doorRotation === 'ver' ? spacing * room.doorSize : spacing}
                                                            width={room.doorRotation === 'hor' ? spacing * room.doorSize : spacing}
                                                            strokeWidth={1}
                                                            stroke={'black'}
                                                            dash={[1, 1]}
                                                        />
                                                    );
                                                })}
                                            </Group>
                                        )}
                                        <Line
                                            points={selectionRegionPoints || [0, 0]}
                                            opacity={selectedTool === Tool.Add ? 1 : 0.3}
                                            strokeWidth={selectedTool === Tool.Add ? spacing : 1}
                                            closed
                                            lineCap={'square'}
                                            stroke={selectedTool === Tool.Add ? 'black' : '#2880E6'}
                                            fill={selectedTool === Tool.Add ? 'white' : '#2880E6'}
                                            visible={selectionRegionStatus}
                                        />
                                    </Layer>
                                </BuildStageContext.Provider>
                            </AppInfoContext.Provider>
                        </Stage>
                    </div>
                    <div className={styles.bottomInfobar}>
                        <div style={{ marginLeft: '20px' }}>x:{mousePosition?.x || 0}</div>
                        <div>y:{mousePosition?.y || 0}</div>
                        <div>Scale:{stageInfo.stageScale}</div>
                        <div  style={{ marginRight: '20px' }}>Selected:{appInfo.selectedRoomName === null ? 'No Room Selected' : appInfo.selectedRoomName}</div>
                    </div>
                </div>
            )}
        </AppInfoContext.Consumer>
    );
};

export default BuildStage;
