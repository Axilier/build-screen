/** @format */

import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Group, Line, Rect } from 'react-konva';
import Konva from 'konva';
import {
    Dimension,
    FixedDragEvent,
    Item,
    RoomType,
    SubTool,
    Tool,
    TransformBar,
    Vector2,
} from '../../Types';
import { AppInfoContext, BuildStageContext } from '../../Context';
import { getRoundedUnit, getShapeInfo, roundCoordinate } from './Utils';
import KonvaEventObject = Konva.KonvaEventObject;

const Room = ({
    index,
    name,
    x,
    y,
    center,
    height,
    width,
    doorPosition,
}: RoomType & { index: number }): JSX.Element => {
    const shape = useRef<Konva.Rect>(null);
    const line = useRef<Konva.Line>(null);
    const group = useRef<Konva.Group>(null);
    const backgroundPos = group.current
        ?.getStage()
        ?.findOne('.BACKGROUND')
        .getPosition() || { x: 0, y: 0 };

    const {
        selectedTool,
        setCursor,
        selectedSubTool,
        selectedShapeName,
        setSelectedShapeName,
        setRoomList,
        roomList,
        spacing,
    } = useContext(AppInfoContext);

    const halfSpacing = spacing / 2;
    const { mousePosition } = useContext(BuildStageContext);

    const [backgroundPosition, setBackgroundPosition] = useState(backgroundPos);
    const [dimensions, setDimensions] = useState<Dimension>({ height, width });
    const [position, setPosition] = useState<Vector2>({ x, y });
    const [corners, setCorners] = useState<Array<Vector2>>(() =>
        getCornersCoords(dimensions, position),
    );
    const [transformBarInfo, setTransformBarInfo] = useState(() =>
        getTransformBarInfo(corners),
    );
    const [doorPositionState, setDoorPositionState] = useState<Vector2 | null>(
        doorPosition || null,
    );
    const [addDoorMode, setAddDoorMode] = useState(false);

    useEffect(() => {
        if (!addDoorMode) return;
        onMouseMove(mousePosition);
    }, [mousePosition]);
    useEffect(() => {
        setBackgroundPosition(backgroundPos);
    }, [backgroundPos.x, backgroundPos.y]);
    useEffect(() => {
        const calCorners = getCornersCoords({ height, width }, { x, y });
        setDimensions({ height, width });
        setPosition({ x, y });
        setTransformBarInfo(getTransformBarInfo(calCorners));
        setCorners(calCorners);
    }, [x, y, height, width, backgroundPosition.x, backgroundPosition.y]);
    useEffect(() => updateRoomList(), [position, dimensions]);
    useEffect(() => setAddDoorMode(selectedSubTool === SubTool.AddDoor), [
        selectedSubTool,
    ]);

    function updateRoomList() {
        const tempRoomList = [...roomList];
        tempRoomList[index] = {
            name,
            x: position.x,
            y: position.y,
            center,
            height: dimensions.height,
            width: dimensions.width,
            doorPosition: tempRoomList[index].doorPosition,
        };
        setRoomList(tempRoomList);
    }

    // region getCorners
    // NOTE Ran at the start to get the corner points from the dimensions
    // DOC Returns Konva coordinates not Axilier units
    function getCornersCoords(dim: Dimension, pos: Vector2): Array<Vector2> {
        const { x: curX, y: curY } = unitToCoordinate(pos);
        return [
            {
                x: curX - halfSpacing - spacing,
                y: curY - halfSpacing - spacing,
            },
            {
                x: curX + width * spacing - halfSpacing,
                y: curY - halfSpacing - spacing,
            },
            {
                x: curX + width * spacing - halfSpacing,
                y: curY + height * spacing - halfSpacing,
            },
            {
                x: curX - halfSpacing - spacing,
                y: curY + height * spacing - halfSpacing,
            },
        ];
    }

    function getCornersUnits(pos: Vector2, dim: Dimension) {
        return [
            { x: pos.x, y: pos.y },
            {
                x: pos.x + dim.width,
                y: pos.y,
            },
            {
                x: pos.x + dim.width,
                y: pos.y + dim.height,
            },
            {
                x: pos.x,
                y: pos.y + dim.height,
            },
        ];
    }

    // endregion

    function pointToArray(pointList: Array<Vector2>): Array<number> {
        return pointList.reduce((total, el) => {
            total.push(el.x);
            total.push(el.y);
            return total;
        }, [] as Array<number>);
    }

    function onClick() {
        setSelectedShapeName(name);
    }

    function cornerResize(cornerIndex: number, newPosition: Vector2) {
        const tempCornersWithStroke = [...corners];
        const newPositionRounded =
            roundCoordinate(newPosition, backgroundPosition, spacing) ||
            newPosition;
        const effectedCornerBehind =
            cornerIndex === 0 ? corners.length - 1 : cornerIndex - 1;
        const effectedCornerAhead =
            cornerIndex + 1 === corners.length ? 0 : cornerIndex + 1;
        if (effectedCornerBehind % 2 === 0) {
            tempCornersWithStroke[effectedCornerBehind].y =
                newPositionRounded.y + halfSpacing;
        } else {
            tempCornersWithStroke[effectedCornerBehind].x =
                newPositionRounded.x + halfSpacing;
        }
        if (effectedCornerAhead % 2 === 0) {
            tempCornersWithStroke[effectedCornerAhead].x =
                newPositionRounded.x + halfSpacing;
        } else {
            tempCornersWithStroke[effectedCornerAhead].y =
                newPositionRounded.y + halfSpacing;
        }
        tempCornersWithStroke[cornerIndex] = {
            x: newPositionRounded.x + halfSpacing,
            y: newPositionRounded.y + halfSpacing,
        };
        group.current
            ?.findOne(`.ANCHOR-${cornerIndex}`)
            .position(newPositionRounded);
        line.current?.setAttr('points', tempCornersWithStroke);
        setCorners(tempCornersWithStroke);
    }

    function unitToCoordinate(coordinate: Vector2): Vector2 {
        console.log(backgroundPosition);
        const { x: backgroundX, y: backgroundY } = backgroundPosition;
        return {
            x: coordinate.x * spacing + backgroundX,
            y: coordinate.y * spacing + backgroundY,
        };
    }

    // region reorderPoints
    // NOTE DOES NOT WORK WITH CONVEX SHAPES -- this is not needed for squares add it later if needed
    function reorderPoints(
        points: Array<number> | Array<Vector2>,
    ): Array<Vector2> {
        const pointsObjects: Array<Vector2> = [];
        if (typeof points[0] === 'number') {
            for (let i = 0; i <= points.length - 1; i += 2) {
                pointsObjects.push({
                    x: points[i] as number,
                    y: points[i + 1] as number,
                });
            }
        } else {
            pointsObjects.push(...(points as Array<Vector2>));
        }
        pointsObjects.sort((a, b) => {
            if (a.x === b.x) return a.y - b.y;
            return a.x - b.x;
        });
        return [
            pointsObjects[0],
            pointsObjects[2],
            pointsObjects[3],
            pointsObjects[1],
        ];
    }

    // endregion

    // region sideResize
    function sideResize(
        sideIndex: number,
        event: KonvaEventObject<FixedDragEvent>,
    ) {
        const tempCorners = [...corners];
        const affectedCorners = [
            sideIndex,
            sideIndex + 1 === corners.length ? 0 : sideIndex + 1,
        ];
        const roundedCoordinate = roundCoordinate(
            {
                x: event.evt.layerX,
                y: event.evt.layerY,
            },
            backgroundPosition,
            spacing,
        );
        if (!roundedCoordinate) return;
        if (sideIndex % 2 === 0) {
            tempCorners[affectedCorners[0]].y =
                roundedCoordinate.y - halfSpacing;
            tempCorners[affectedCorners[1]].y =
                roundedCoordinate.y - halfSpacing;
        } else {
            tempCorners[affectedCorners[0]].x =
                roundedCoordinate.x - halfSpacing;
            tempCorners[affectedCorners[1]].x =
                roundedCoordinate.x - halfSpacing;
        }
        line.current
            ?.getStage()
            ?.findOne(`.${name}`)
            .setAttr('points', pointToArray(tempCorners));
        updateShape(tempCorners);
    }

    // endregion

    function updateShape(inputCorners?: Array<Vector2> | null) {
        const pointsOrdered = reorderPoints(
            inputCorners || getCornersCoords(dimensions, position),
        );
        const shapeInfo = getShapeInfo(
            pointsOrdered,
            spacing,
            backgroundPosition,
        );
        setDimensions({
            width: shapeInfo.width,
            height: shapeInfo.height,
        });
        setPosition({
            x: shapeInfo.x,
            y: shapeInfo.y,
        });
        setTransformBarInfo(getTransformBarInfo(pointsOrdered));
        setCorners(pointsOrdered);
    }

    // region getTransformBarInfo
    function getTransformBarInfo(
        curCorners?: Array<Vector2> | null,
    ): Array<TransformBar> {
        const dimensionsAsCoord = corners
            ? getShapeInfo(corners, spacing, backgroundPosition)
            : dimensions;
        const heightAsUnits = dimensionsAsCoord.height * spacing;
        const widthAsUnits = dimensionsAsCoord.width * spacing;
        const { x: curX, y: curY } = curCorners
            ? curCorners[0]
            : roundCoordinate(position, backgroundPosition, spacing) ||
              position;
        return [
            {
                x: curX + widthAsUnits / 2 - widthAsUnits * 0.3,
                y: curY - halfSpacing,
                height: spacing,
                width: widthAsUnits * 0.6,
            },
            {
                x: curX + widthAsUnits + halfSpacing,
                y: curY + heightAsUnits / 2 - heightAsUnits * 0.3,
                height: heightAsUnits * 0.6,
                width: spacing,
            },
            {
                x: curX + widthAsUnits / 2 - widthAsUnits * 0.3,
                y: curY + heightAsUnits + halfSpacing,
                height: spacing,
                width: widthAsUnits * 0.6,
            },
            {
                x: curX - halfSpacing,
                y: curY + heightAsUnits / 2 - heightAsUnits * 0.3,
                height: heightAsUnits * 0.6,
                width: spacing,
            },
        ];
    }

    // endregion

    function setCursorChecked(cursor: string) {
        if (selectedTool === Tool.Selector && selectedShapeName === name) {
            setCursor(cursor);
        }
    }

    // region pointInside
    function pointInside(
        room: RoomType | (Vector2 & Dimension),
        point: Vector2,
    ): boolean {
        let inside = true;
        if (point.y < room.y) inside = false;
        if (point.x < room.x) inside = false;
        if (point.y > room.y + room.height) inside = false;
        if (point.x > room.x + room.width) inside = false;
        return inside;
    }

    // endregion

    function shapeIntersects(shapePosition: Vector2): boolean {
        const roundedPosition = getRoundedUnit(
            shapePosition,
            backgroundPosition,
            spacing,
        );
        const curCorners = getCornersUnits(roundedPosition, dimensions);
        return roomList.some((room, roomIndex) => {
            if (roomIndex === index) return false; // doesnt intersect
            const cornerIntersects = curCorners.some(corner => {
                return pointInside(room, corner);
            });
            return (
                cornerIntersects ||
                getCornersUnits(
                    { x: room.x, y: room.y },
                    { width: room.width, height: room.height },
                ).some(corner => {
                    return pointInside(
                        { ...roundedPosition, ...dimensions },
                        corner,
                    );
                })
            );
        });
    }

    function onDrag(event: KonvaEventObject<DragEvent>) {
        const shapePosition = {
            x: event.target.attrs.x,
            y: event.target.attrs.y,
        };
        const background = group.current?.getStage()?.findOne('.BACKGROUND');
        if (!background) return;
        const roundedCoordinate = getRoundedUnit(
            shapePosition,
            backgroundPosition,
            spacing,
        );
        const backgroundSize = {
            height: background.height() / spacing,
            width: background.width() / spacing,
        };
        const containedX =
            roundedCoordinate.x <= 0
                ? 0
                : roundedCoordinate.x >= backgroundSize.width - dimensions.width
                ? backgroundSize.width - dimensions.width
                : roundedCoordinate.x;
        const containedY =
            roundedCoordinate.y <= 0
                ? 0
                : roundedCoordinate.y >=
                  backgroundSize.height - dimensions.height
                ? backgroundSize.height - dimensions.height
                : roundedCoordinate.y;
        let newPosition = {
            x: containedX,
            y: containedY,
        };
        if (shapeIntersects(shapePosition)) {
            newPosition = position;
        }
        shape.current?.position({
            x: backgroundPosition.x + newPosition.x * spacing - spacing,
            y: backgroundPosition.y + newPosition.y * spacing - spacing,
        });
        const newCorners = getCornersCoords(dimensions, newPosition);
        line.current?.attrs('points', newCorners);
        setPosition(newPosition);
        setTransformBarInfo(getTransformBarInfo(newCorners));
        setCorners(newCorners);
    }

    function onMouseMove(curMousePosition: Vector2) {
        const curDoorPosition: Vector2 = { x: 0, y: 0 };
        const containedX =
            curMousePosition.x <= position.x - spacing
                ? position.x - halfSpacing
                : curMousePosition.x >= position.x + dimensions.width
                ? position.x + dimensions.width + halfSpacing
                : curMousePosition.x;
        if (curMousePosition.y <= position.y) {
            curDoorPosition.y = position.y - halfSpacing;
            curDoorPosition.x = containedX;
        } else if (curMousePosition.y >= position.y + dimensions.height) {
            curDoorPosition.y = position.y + dimensions.height + halfSpacing;
            curDoorPosition.x = containedX;
        } else if (curMousePosition.x <= position.x) {
            curDoorPosition.x = position.x - halfSpacing;
            curDoorPosition.y = mousePosition.y;
        } else if (curMousePosition.x >= position.x + dimensions.width) {
            curDoorPosition.x = position.x + dimensions.width + halfSpacing;
            curDoorPosition.y = mousePosition.y;
        }
        setDoorPositionState(curDoorPosition);
    }

    function getDragBounds(draggedPosition: Vector2): Vector2 {
        if (shapeIntersects(draggedPosition)) {
            const shapePos = unitToCoordinate(position);
            shape.current?.position({
                x: shapePos.x,
                y: shapePos.y,
            });
            return unitToCoordinate(position);
        }
        return draggedPosition;
    }

    return (
        <BuildStageContext.Consumer>
            {buildStageContext => (
                <AppInfoContext.Consumer>
                    {appInfo => {
                        return (
                            <Group
                                name={'this_group'}
                                ref={group}
                                onContextMenu={() =>
                                    appInfo.setContextMenuStatus(Item.room)
                                }
                            >
                                {appInfo.selectedTool === Tool.Selector ? (
                                    <Line
                                        name={name}
                                        ref={line}
                                        key={`LINE-${name}`}
                                        points={pointToArray(corners)}
                                        strokeWidth={spacing}
                                        closed
                                        onClick={() => onClick()}
                                        lineCap={'square'}
                                        stroke={'black'}
                                        fill={'white'}
                                    />
                                ) : (
                                    <Group>
                                        <Rect
                                            x={
                                                backgroundPosition.x +
                                                position.x * spacing -
                                                spacing * 2
                                            }
                                            y={
                                                backgroundPosition.y +
                                                position.y * spacing -
                                                spacing * 2
                                            }
                                            height={
                                                dimensions.height * spacing +
                                                spacing * 2
                                            }
                                            width={
                                                dimensions.width * spacing +
                                                spacing * 2
                                            }
                                            fill={'black'}
                                            name={name}
                                        />
                                        <Rect
                                            ref={shape}
                                            x={
                                                backgroundPosition.x +
                                                position.x * spacing -
                                                spacing
                                            }
                                            y={
                                                backgroundPosition.y +
                                                position.y * spacing -
                                                spacing
                                            }
                                            draggable
                                            onClick={() => onClick()}
                                            onDragMove={e => onDrag(e)}
                                            dragBoundFunc={pos =>
                                                getDragBounds(pos)
                                            }
                                            height={dimensions.height * spacing}
                                            width={dimensions.width * spacing}
                                            fill={'white'}
                                        />
                                    </Group>
                                )}
                                {corners.map(
                                    (
                                        { x: cornerX, y: cornerY },
                                        cornerIndex,
                                    ) => (
                                        <Group
                                            key={`ANCHOR-${name}-${cornerIndex}`}
                                            name={`ANCHOR-${name}-${cornerIndex}`}
                                            x={cornerX - spacing / 2}
                                            y={cornerY - spacing / 2}
                                            draggable
                                            onDragMove={(
                                                event: KonvaEventObject<FixedDragEvent>,
                                            ) =>
                                                cornerResize(index, {
                                                    x: event.evt.layerX,
                                                    y: event.evt.layerY,
                                                })
                                            }
                                            onDragEnd={() =>
                                                updateShape(corners)
                                            }
                                            visible={
                                                appInfo.selectedTool ===
                                                    Tool.Selector &&
                                                appInfo.selectedShapeName ===
                                                    name
                                            }
                                            onMouseEnter={() =>
                                                setCursorChecked(
                                                    index % 2 === 0
                                                        ? 'nw-resize'
                                                        : 'nesw-resize',
                                                )
                                            }
                                            onMouseLeave={() =>
                                                setCursorChecked('default')
                                            }
                                        >
                                            <Rect
                                                name={`ANCHOR-${index}-0`}
                                                fill={'black'}
                                                height={10}
                                                width={10}
                                            />
                                            <Rect
                                                x={1}
                                                y={1}
                                                fill={'white'}
                                                height={8}
                                                width={8}
                                            />
                                        </Group>
                                    ),
                                )}
                                {transformBarInfo.map(
                                    (
                                        {
                                            x: transformBarX,
                                            y: transformBarY,
                                            height: barHeight,
                                            width: barWidth,
                                        },
                                        barIndex,
                                    ) =>
                                        appInfo.selectedTool ===
                                        Tool.Selector ? (
                                            <Rect
                                                x={transformBarX}
                                                y={transformBarY}
                                                height={barHeight}
                                                width={barWidth}
                                                key={`TRANSFORM-${name}-${barIndex}`}
                                                draggable
                                                dragBoundFunc={pos => {
                                                    return {
                                                        x:
                                                            barIndex % 2 === 0
                                                                ? transformBarX
                                                                : pos.x,
                                                        y:
                                                            barIndex % 2 === 0
                                                                ? pos.y
                                                                : transformBarY,
                                                    };
                                                }}
                                                onMouseEnter={() =>
                                                    setCursorChecked(
                                                        barIndex % 2 === 0
                                                            ? 'n-resize'
                                                            : 'e-resize',
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setCursorChecked('default')
                                                }
                                                onDragMove={(
                                                    event: KonvaEventObject<FixedDragEvent>,
                                                ) => {
                                                    if (
                                                        appInfo.selectedTool !==
                                                            Tool.Selector ||
                                                        appInfo.selectedShapeName !==
                                                            name
                                                    )
                                                        return;
                                                    sideResize(barIndex, event);
                                                }}
                                            />
                                        ) : null,
                                )}
                                {doorPositionState ? (
                                    <Rect
                                        name={`DOOR-${name}`}
                                        x={doorPositionState.x - halfSpacing}
                                        y={doorPositionState.y - halfSpacing}
                                        fill={'white'}
                                        width={spacing}
                                        height={spacing}
                                    />
                                ) : null}
                            </Group>
                        );
                    }}
                </AppInfoContext.Consumer>
            )}
        </BuildStageContext.Consumer>
    );
};

export default Room;
