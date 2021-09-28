import Konva from 'konva';
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';
import styles from '../../css/BuildStage.module.css';
import Room from './Room';
import Background from './Background';
import { FixedMouseEvent, SubTool, Tool, Vector2 } from '../../Types';
import { AppInfoContext, BuildStageContext } from '../../Context';
import KonvaEventObject = Konva.KonvaEventObject;

export const BuildStage = ({ propertiesWindow }: { propertiesWindow: boolean }): JSX.Element => {
    const backgroundSize = { height: 600, width: 950 };
    const { selectedTool, cursor, spacing, setRoomList, roomList, selectedSubTool, selectedRoomName } = useContext(AppInfoContext);
    const stage = useRef<Konva.Stage>(null);
    const [dimensions, setDimensions] = useState([window.innerWidth - (propertiesWindow ? 580 : 80), window.innerHeight - 100]);
    const [backgroundPosition, setBackgroundPosition] = useState({
        x: dimensions[0] / 2 - backgroundSize.width / 2,
        y: dimensions[1] / 2 - backgroundSize.height / 2,
    });
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

    useEffect(() => {
        window.addEventListener('resize', () => newDimensions());
    }, []);
    useEffect(() => setDimensions([window.innerWidth - (propertiesWindow ? 580 : 80), window.innerHeight - 100]), [propertiesWindow]);
    useEffect(() => {
        if (selectedSubTool === SubTool.AddDoor) {
            if (roomList.length === 1) return;
            const selectedRoomIndex = roomList.findIndex(room => room.name === selectedRoomName);
            const tempRoomList = roomList.splice(selectedRoomIndex, 1);
            setRoomList([roomList[selectedRoomIndex], ...tempRoomList]);
        }
    }, [roomList, selectedRoomName, selectedSubTool, setRoomList]);

    const newDimensions = () => setDimensions([window.innerWidth - 580, window.innerHeight - 100]);

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        if (selectedSubTool === SubTool.AddDoor) return;
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

    // function partsFromName(name: string): { partType: string, shapeType: ShapeType, index.ts: number } {
    //     const parts = name.split("-")
    //     return {partType: parts[0], shapeType: parseInt(parts[1]) as ShapeType, index.ts: parseInt(parts[2])}
    // }

    const onMouseDown = (event: KonvaEventObject<FixedMouseEvent>) => {
        // console.log(stage.current?.getIntersection({ x: event.evt.layerX, y: event.evt.layerY }));
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
        // else if (name.includes('SHAPE')) {
        //     const parts = partsFromName(name);
        //     switch (selectedTool) {
        //         case Tool.Selector: {
        //             const shapePoints = stage?.current!.find(`.${name}`)[0]
        //                 .attrs.points;
        //             const anchorPoints: Array<Vector2> = [];
        //             shapePoints.forEach((point: number, index.ts: number) => {
        //                 if (index.ts % 2 === 0) {
        //                     anchorPoints.push({ x: point, y: 0 });
        //                 } else {
        //                     anchorPoints[anchorPoints.length - 1].y = point;
        //                 }
        //             });
        //         }
        //     }
        // }
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
            setRoomList([
                ...roomList,
                {
                    name: `Room-${roomList.length + 1}`,
                    doorPosition: null,
                    ...position,
                    height,
                    width,
                },
            ]);
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
                    <div key={'test1'} className={styles.konvaCanvas} style={{ cursor }}>
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
                                        <Background
                                            height={backgroundSize.height}
                                            width={backgroundSize.width}
                                            // onMouseDown={(event: KonvaEventObject<FixedMouseEvent>) => onMouseDown(event)}
                                            onMouseMove={() => null}
                                            onMouseUp={() => null}
                                            screenWidth={dimensions[0]}
                                            screenHeight={dimensions[1]}
                                        />
                                    </Layer>
                                    <Layer>
                                        {appInfo.roomList.map((room, index) => {
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
                                        {appInfo.roomList.flatMap(room => {
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
                        <div>x:{mousePosition?.x || 0}</div>
                        <div>y:{mousePosition?.y || 0}</div>
                        <div>Scale:{stageInfo.stageScale}</div>
                        <div>Selected:{appInfo.selectedRoomName}</div>
                    </div>
                </div>
            )}
        </AppInfoContext.Consumer>
    );
};

export default BuildStage;
