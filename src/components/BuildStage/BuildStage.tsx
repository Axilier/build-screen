/** @format */

import Konva from 'konva';
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import '../../css/BuildScreen.css';
import { Layer, Line, Stage } from 'react-konva';
import Room from './Room';
import Background from './Background';
import { FixedMouseEvent, Tool, Vector2 } from '../../Types';
import { AppInfoContext, BuildStageContext } from '../../Context';
import KonvaEventObject = Konva.KonvaEventObject;

export const BuildStage = (): JSX.Element => {
    const { selectedTool, cursor, spacing, setRoomList, roomList } = useContext(
        AppInfoContext,
    );

    const stage = useRef<Konva.Stage>(null);
    const backgroundPos = stage.current
        ?.findOne('.BACKGROUND')
        .getPosition() || { x: 0, y: 0 };

    const [dimensions, setDimensions] = useState([
        window.innerWidth - 580,
        window.innerHeight - 100,
    ]);
    const [stageInfo, setStageInfo] = useState({
        stageScale: 1,
        stageX: 0,
        stageY: 0,
    });

    const [mousePressed, setMousePressed] = useState(false); // DOC is the mouse currently pressed
    const [mousePressedPosition, setMousePressedPosition] = useState<Vector2>(); // DOC the initial position the mouse was pressed for dragging
    const [mousePosition, setMousePosition] = useState<Vector2>({ x: 0, y: 0 }); // DOC the current position of the cursor
    const [selectionRegionPoints, setSelectionRegionPoints] = useState<
        Array<number>
    >();
    const [selectionRegionStatus, setSelectionRegionStatus] = useState(false); // true -- shown, false -- hidden

    useEffect(() => {
        window.addEventListener('resize', () => newDimensions());
    }, []);

    const newDimensions = () =>
        setDimensions([window.innerWidth - 580, window.innerHeight - 100]);

    // function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    //     if (e.evt.ctrlKey) {
    //         e.evt.preventDefault();
    //         const scaleBy = 1.15;
    //         const stage = e.target.getStage();
    //         if (stage === null) return;
    //         const oldScale = stage.scaleX();
    //         const mousePointTo = {
    //             x:
    //                 stage.getPointerPosition()!.x / oldScale -
    //                 stage.x() / oldScale,
    //             y:
    //                 stage.getPointerPosition()!.y / oldScale -
    //                 stage.y() / oldScale,
    //         };
    //
    //         const newScale =
    //             e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    //         if (newScale > 2 || newScale < 0.5) return;
    //         setStageInfo({
    //             stageScale: newScale,
    //             stageX:
    //                 -(
    //                     mousePointTo.x -
    //                     stage.getPointerPosition()!.x / newScale
    //                 ) * newScale,
    //             stageY:
    //                 -(
    //                     mousePointTo.y -
    //                     stage.getPointerPosition()!.y / newScale
    //                 ) * newScale,
    //         });
    //     } else if (e.evt.shiftKey) {
    //         const newPosition =
    //             e.evt.deltaY > 0
    //                 ? stageInfo.stageX + 30
    //                 : stageInfo.stageX - 30;
    //         setStageInfo({
    //             ...stageInfo,
    //             stageX: newPosition,
    //         });
    //     } else {
    //         const newPosition =
    //             e.evt.deltaY > 0
    //                 ? stageInfo.stageY - 30
    //                 : stageInfo.stageY + 30;
    //         setStageInfo({
    //             ...stageInfo,
    //             stageY: newPosition,
    //         });
    //     }
    // }

    // function partsFromName(name: string): { partType: string, shapeType: ShapeType, index: number } {
    //     const parts = name.split("-")
    //     return {partType: parts[0], shapeType: parseInt(parts[1]) as ShapeType, index: parseInt(parts[2])}
    // }

    function onMouseDown(event: KonvaEventObject<FixedMouseEvent>) {
        const { name } = event.currentTarget.attrs;
        if (name.includes('BACKGROUND') || name.includes('STAGE')) {
            switch (selectedTool) {
                case Tool.Cursor:
                case Tool.Selector:
                case Tool.Add:
                    setMousePressed(true);
                    setMousePressedPosition({
                        x: event.evt.layerX,
                        y: event.evt.layerY,
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
        //             shapePoints.forEach((point: number, index: number) => {
        //                 if (index % 2 === 0) {
        //                     anchorPoints.push({ x: point, y: 0 });
        //                 } else {
        //                     anchorPoints[anchorPoints.length - 1].y = point;
        //                 }
        //             });
        //         }
        //     }
        // }
    }

    function onMouseUp() {
        setMousePressed(false);
        setSelectionRegionStatus(false);
        if (selectedTool === Tool.Add && mousePressedPosition) {
            const width = Math.round(
                Math.abs(mousePressedPosition.x - mousePosition.x) / spacing,
            );
            const height = Math.round(
                Math.abs(mousePressedPosition.y - mousePosition.y) / spacing,
            );
            const position = {
                x:
                    Math.round(
                        (mousePressedPosition.x - backgroundPos.x) / spacing,
                    ) + 1,
                y:
                    Math.round(
                        (mousePressedPosition.y - backgroundPos.y) / spacing,
                    ) + 1,
            };
            setRoomList([
                ...roomList,
                {
                    name: `Room-${roomList.length + 1}`,
                    doorPosition: null,
                    ...position,
                    center: {
                        x: position.x + width / 2,
                        y: position.y + height / 2,
                    },
                    height,
                    width,
                },
            ]);
        }
        setMousePressedPosition(undefined);
    }

    function updateSelectionBox() {
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
    }

    function onMouseMove(event: KonvaEventObject<FixedMouseEvent>) {
        setMousePosition({ x: event.evt.layerX, y: event.evt.layerY });
        switch (selectedTool) {
            case Tool.Cursor:
            case Tool.Selector:
            case Tool.Add:
                updateSelectionBox();
                break;
            default:
                break;
        }
    }

    return (
        <AppInfoContext.Consumer>
            {appInfo => (
                <div className={'build-stage'}>
                    <div className={'konva-canvas'} style={{ cursor }}>
                        <Stage
                            name={'STAGE'}
                            ref={stage}
                            container={'.konva-canvas'}
                            x={stageInfo.stageX}
                            y={stageInfo.stageY}
                            width={dimensions[0]}
                            height={dimensions[1]}
                            scaleX={stageInfo.stageScale}
                            scaleY={stageInfo.stageScale}
                            // onWheel={e => handleWheel(e)}
                            onMouseDown={(
                                event: KonvaEventObject<FixedMouseEvent>,
                            ) => onMouseDown(event)}
                            onMouseMove={(
                                event: KonvaEventObject<FixedMouseEvent>,
                            ) => onMouseMove(event)}
                            onMouseUp={() => onMouseUp()}
                        >
                            <AppInfoContext.Provider value={appInfo}>
                                <BuildStageContext.Provider
                                    value={{
                                        mousePosition,
                                    }}
                                >
                                    <Layer>
                                        <Background
                                            // onMouseDown={(event: KonvaEventObject<FixedMouseEvent>) => onMouseDown(event)}
                                            onMouseMove={(
                                                event: KonvaEventObject<FixedMouseEvent>,
                                            ) => onMouseMove(event)}
                                            onMouseUp={() => onMouseUp()}
                                            screenWidth={dimensions[0]}
                                            screenHeight={dimensions[1]}
                                        />
                                    </Layer>
                                    <Layer>
                                        {appInfo.roomList.map(
                                            (
                                                {
                                                    name,
                                                    x,
                                                    y,
                                                    width,
                                                    height,
                                                    center,
                                                },
                                                index,
                                            ) => (
                                                <>
                                                    <Room
                                                        key={name}
                                                        index={index}
                                                        name={name}
                                                        x={x}
                                                        y={y}
                                                        center={center}
                                                        width={width}
                                                        height={height}
                                                    />
                                                    {/* <Rect */}
                                                    {/*    x={ */}
                                                    {/*        center.x * spacing +*/}
                                                    {/*        backgroundPos.x -*/}
                                                    {/*        spacing -*/}
                                                    {/*        spacing / 2 */}
                                                    {/*    } */}
                                                    {/*    y={ */}
                                                    {/*        center.y * spacing +*/}
                                                    {/*        backgroundPos.y -*/}
                                                    {/*        spacing -*/}
                                                    {/*        spacing / 2 */}
                                                    {/*    } */}
                                                    {/*    height={spacing} */}
                                                    {/*    width={spacing} */}
                                                    {/*    fill={'red'} */}
                                                    {/* /> */}
                                                </>
                                            ),
                                        )}
                                        <Line
                                            points={
                                                selectionRegionPoints || [0, 0]
                                            }
                                            opacity={
                                                selectedTool === Tool.Add
                                                    ? 1
                                                    : 0.3
                                            }
                                            strokeWidth={
                                                selectedTool === Tool.Add
                                                    ? spacing
                                                    : 1
                                            }
                                            closed
                                            lineCap={'square'}
                                            stroke={
                                                selectedTool === Tool.Add
                                                    ? 'black'
                                                    : '#2880E6'
                                            }
                                            fill={
                                                selectedTool === Tool.Add
                                                    ? 'white'
                                                    : '#2880E6'
                                            }
                                            visible={selectionRegionStatus}
                                        />
                                    </Layer>
                                </BuildStageContext.Provider>
                            </AppInfoContext.Provider>
                        </Stage>
                    </div>
                    <div className={'bottom-infobar'}>
                        <div>
                            {'x: '}
                            {mousePosition?.x || 0}
                        </div>
                        <div>
                            {'y: '}
                            {mousePosition?.y || 0}
                        </div>
                        <div>{stageInfo.stageScale}</div>
                        <div>{appInfo.selectedShapeName}</div>
                    </div>
                </div>
            )}
        </AppInfoContext.Consumer>
    );
};

export default BuildStage;
