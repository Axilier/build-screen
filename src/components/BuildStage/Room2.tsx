import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Group, Line, Rect } from 'react-konva';
import Konva from 'konva';
import { Dimension, FixedDragEvent, FixedMouseEvent, Item, RoomType, SubTool, Tool, TransformBar, Vector2 } from '../../Types';
import { AppInfoContext, BuildStageContext } from '../../Context';
import { getRoundedUnit, getShapeInfo, roundCoordinate } from './Utils';
import KonvaEventObject = Konva.KonvaEventObject;

const Room = ({ index, name, x, y, height, width, doorPosition }: RoomType & { index: number }): JSX.Element => {
    const shape = useRef<Konva.Rect>(null);
    const line = useRef<Konva.Line>(null);
    const group = useRef<Konva.Group>(null);
    const backgroundPos = group.current?.getStage()?.findOne('.BACKGROUND').getPosition() || {
        x: 0,
        y: 0,
    };

    const {
        selectedTool,
        setCursor,
        selectedSubTool,
        setSelectedSubTool,
        selectedRoomName,
        setSelectedRoomName,
        setRoomList,
        roomList,
        spacing,
    } = useContext(AppInfoContext);

    const halfSpacing = spacing / 2;
    const [backgroundPosition, setBackgroundPosition] = useState(backgroundPos);

    // region unitToCoordinate
    const unitToCoordinate = useCallback(
        (coordinate: Vector2) => {
            return {
                x: coordinate.x * spacing + backgroundPosition.x,
                y: coordinate.y * spacing + backgroundPosition.y,
            };
        },
        [backgroundPosition.x, backgroundPosition.y, spacing],
    );
    // endregion

    // region getCorners
    // NOTE Ran at the start to get the corner points from the dimensions
    // DOC Returns Konva coordinates not Axilier units
    const getCornersCoords = useCallback(
        (dim, pos) => {
            const { x: curX, y: curY } = unitToCoordinate(pos);
            return [
                {
                    x: curX - halfSpacing - spacing,
                    y: curY - halfSpacing - spacing,
                },
                {
                    x: curX + dim.width * spacing - halfSpacing,
                    y: curY - halfSpacing - spacing,
                },
                {
                    x: curX + dim.width * spacing - halfSpacing,
                    y: curY + dim.height * spacing - halfSpacing,
                },
                {
                    x: curX - halfSpacing - spacing,
                    y: curY + dim.height * spacing - halfSpacing,
                },
            ];
        },
        [spacing, halfSpacing, unitToCoordinate],
    );
    // endregion

    const getTransformBarInfo = (curCorners?: Array<Vector2> | null): Array<TransformBar> => {
        const dimensionsAsCoord = corners ? getShapeInfo(corners, spacing, backgroundPosition) : dimensions;
        const heightAsUnits = dimensionsAsCoord.height * spacing;
        const widthAsUnits = dimensionsAsCoord.width * spacing;
        const { x: curX, y: curY } = curCorners ? curCorners[0] : roundCoordinate(position, backgroundPosition, spacing) || position;
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
    };

    const { mousePosition } = useContext(BuildStageContext);

    const [dimensions, setDimensions] = useState<Dimension>({ height, width });
    const [position, setPosition] = useState<Vector2>({ x, y });
    const [corners, setCorners] = useState<Array<Vector2>>(() => getCornersCoords(dimensions, position));
    const [transformBarInfo, setTransformBarInfo] = useState(() => getTransformBarInfo(corners));
    const [doorPositionState, setDoorPositionState] = useState<Vector2 | null>(null);
    const [addDoorMode, setAddDoorMode] = useState(false);
    const [doorRotation, setDoorRotation] = useState<'hor' | 'ver'>('hor');
    const [doorSize, setDoorSize] = useState(4);
    const [doorRelativeToRoom, setDoorRelativeToRoom] = useState<Vector2 | null>(doorPosition || null);

    const updateRoomList = useCallback(() => {
        const tempRoomList = [...roomList];
        tempRoomList[index] = {
            name,
            x: position.x,
            y: position.y,
            height: dimensions.height,
            width: dimensions.width,
            doorPosition: doorRelativeToRoom,
        };
        setRoomList(tempRoomList);
    }, [index, name, position, dimensions, doorRelativeToRoom, setRoomList]);

    // region handleWheel
    const handleWheel = useCallback(
        event => {
            if (selectedRoomName !== name || !doorPositionState) return;
            const curCoordCorners = getCornersCoords(dimensions, position);
            if (event.deltaY < 0) {
                if (doorRotation === 'ver') {
                    if (event.shiftKey) {
                        const bottomLeft = doorPositionState.y + (doorSize + 0.1) * spacing;
                        if (bottomLeft <= curCoordCorners[2].y - halfSpacing) {
                            setDoorSize(doorSize + 0.1);
                        }
                    } else {
                        const bottomLeft = doorPositionState.y + (doorSize + 1) * spacing;
                        if (bottomLeft <= curCoordCorners[2].y - halfSpacing) {
                            setDoorSize(doorSize + 1);
                        }
                    }
                } else if (doorRotation === 'hor') {
                    if (event.shiftKey) {
                        const bottomRight = doorPositionState.x + (doorSize + 0.1) * spacing;
                        if (bottomRight <= curCoordCorners[1].x - halfSpacing) {
                            setDoorSize(doorSize + 0.1);
                        }
                    } else {
                        const bottomRight = doorPositionState.x + (doorSize + 1) * spacing;
                        if (bottomRight <= curCoordCorners[1].x - halfSpacing) {
                            setDoorSize(doorSize + 1);
                        }
                    }
                }
            } else {
                if (doorSize <= 1) return;
                setDoorSize(doorSize - 1);
            }
        },
        [halfSpacing, getCornersCoords, doorSize, selectedRoomName, doorPositionState, dimensions, position, doorRotation, name, spacing],
    );
    // endregion

    const unitRelativeToRoom = (objectPosition: Vector2): Vector2 => {
        const coordPosition = unitToCoordinate(position);
        const xDiff = objectPosition.x - coordPosition.x;
        const yDiff = objectPosition.y - coordPosition.y;
        return { x: xDiff, y: yDiff };
    };

    // region onClick
    const onClick = useCallback(() => {
        if (selectedRoomName !== name) return;
        if (addDoorMode) {
            setAddDoorMode(false);
            setSelectedSubTool(SubTool.null);
            if (!doorPositionState) return;
            setDoorRelativeToRoom(unitRelativeToRoom(doorPositionState));
            updateRoomList();
        }
    }, [updateRoomList, addDoorMode, doorPositionState, selectedRoomName, setSelectedSubTool, unitRelativeToRoom, name]);
    // endregion

    useEffect(() => {
        setBackgroundPosition({ x: backgroundPos.x, y: backgroundPos.y });
    }, [backgroundPos.x, backgroundPos.y]);
    useEffect(() => {
        setPosition({ x, y });
    }, [x, y]);
    useEffect(() => {
        const calCorners = getCornersCoords({ height, width }, { x, y });
        setDimensions({ height, width });
        setTransformBarInfo(getTransformBarInfo(calCorners));
        setCorners(calCorners);
    }, [x, y, height, width, backgroundPosition.x, backgroundPosition.y]);
    useEffect(() => updateRoomList(), [updateRoomList, position, dimensions]);
    useEffect(() => {
        setAddDoorMode(selectedSubTool === SubTool.AddDoor && selectedRoomName === name);
    }, [selectedSubTool, selectedRoomName, name]);
    useEffect(() => {
        window.addEventListener('wheel', handleWheel);
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);
    useEffect(() => {
        window.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('click', onClick);
        };
    }, [onClick]);

    const getCornersUnits = (pos: Vector2, dim: Dimension) => {
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
    };

    // endregion

    const pointToArray = (pointList: Array<Vector2>): number[] => {
        return pointList.reduce((total, el) => {
            total.push(el.x);
            total.push(el.y);
            return total;
        }, [] as number[]);
    };

    const cornerResize = (cornerIndex: number, newPosition: Vector2) => {
        const tempCornersWithStroke = [...corners];
        const newPositionRounded = roundCoordinate(newPosition, backgroundPosition, spacing) || newPosition;
        const effectedCornerBehind = cornerIndex === 0 ? corners.length - 1 : cornerIndex - 1;
        const effectedCornerAhead = cornerIndex + 1 === corners.length ? 0 : cornerIndex + 1;
        if (effectedCornerBehind % 2 === 0) {
            tempCornersWithStroke[effectedCornerBehind].y = newPositionRounded.y + halfSpacing;
        } else {
            tempCornersWithStroke[effectedCornerBehind].x = newPositionRounded.x + halfSpacing;
        }
        if (effectedCornerAhead % 2 === 0) {
            tempCornersWithStroke[effectedCornerAhead].x = newPositionRounded.x + halfSpacing;
        } else {
            tempCornersWithStroke[effectedCornerAhead].y = newPositionRounded.y + halfSpacing;
        }
        tempCornersWithStroke[cornerIndex] = {
            x: newPositionRounded.x + halfSpacing,
            y: newPositionRounded.y + halfSpacing,
        };
        setDoorRelativeToRoom(null);
        group.current?.findOne(`.ANCHOR-${cornerIndex}`).position(newPositionRounded);
        line.current?.setAttr('points', tempCornersWithStroke);
        setCorners(tempCornersWithStroke);
    };

    // region reorderPoints
    // NOTE DOES NOT WORK WITH CONVEX SHAPES -- this is not needed for squares add it later if needed
    const reorderPoints = (points: Array<number> | Array<Vector2>): Array<Vector2> => {
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
        return [pointsObjects[0], pointsObjects[2], pointsObjects[3], pointsObjects[1]];
    };

    // endregion

    // region sideResize
    const sideResize = (sideIndex: number, event: KonvaEventObject<FixedDragEvent>) => {
        const tempCorners = [...corners];
        const affectedCorners = [sideIndex, sideIndex + 1 === corners.length ? 0 : sideIndex + 1];
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
            tempCorners[affectedCorners[0]].y = roundedCoordinate.y - halfSpacing;
            tempCorners[affectedCorners[1]].y = roundedCoordinate.y - halfSpacing;
        } else {
            tempCorners[affectedCorners[0]].x = roundedCoordinate.x - halfSpacing;
            tempCorners[affectedCorners[1]].x = roundedCoordinate.x - halfSpacing;
        }
        line.current?.getStage()?.findOne(`.${name}`).setAttr('points', pointToArray(tempCorners));
        updateShape(tempCorners);
    };

    // endregion

    const updateShape = (inputCorners?: Array<Vector2> | null) => {
        const pointsOrdered = reorderPoints(inputCorners || getCornersCoords(dimensions, position));
        const shapeInfo = getShapeInfo(pointsOrdered, spacing, backgroundPosition);
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
    };

    const setCursorChecked = (cursor: string) => {
        if (selectedTool === Tool.Selector && selectedRoomName === name) {
            setCursor(cursor);
        }
    };

    const pointInside = (room: RoomType | (Vector2 & Dimension), point: Vector2): boolean => {
        let inside = true;
        if (point.y < room.y) inside = false;
        if (point.x < room.x) inside = false;
        if (point.y > room.y + room.height) inside = false;
        if (point.x > room.x + room.width) inside = false;
        return inside;
    };

    const shapeIntersects = (shapePosition: Vector2): boolean => {
        const roundedPosition = getRoundedUnit(shapePosition, backgroundPosition, spacing);
        const curCorners = getCornersUnits(roundedPosition, dimensions);
        return roomList.some((room, roomIndex) => {
            if (roomIndex === index) return false; // doesnt intersect
            const cornerIntersects = curCorners.some(corner => {
                return pointInside(room, corner);
            });
            return (
                cornerIntersects ||
                getCornersUnits({ x: room.x, y: room.y }, { width: room.width, height: room.height }).some(corner => {
                    return pointInside({ ...roundedPosition, ...dimensions }, corner);
                })
            );
        });
    };

    const onDrag = (event: KonvaEventObject<DragEvent>) => {
        const shapePosition = {
            x: event.target.attrs.x,
            y: event.target.attrs.y,
        };
        const background = group.current?.getStage()?.findOne('.BACKGROUND');
        if (!background) return;
        const roundedCoordinate = getRoundedUnit(shapePosition, backgroundPosition, spacing);
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
                : roundedCoordinate.y >= backgroundSize.height - dimensions.height
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
    };

    // region closestOnSegment
    const closestOnSegment = (point: Vector2, { start, end }: { start: Vector2; end: Vector2 }, widthConstraint?: number): Vector2 | false => {
        const orderedX = [start, end].sort((a, b) => a.x - b.x);
        const orderedY = [start, end].sort((a, b) => a.y - b.y);
        if (start.x === end.x) {
            // vert
            if (widthConstraint && widthConstraint > Math.abs(end.y - start.y)) return false;
            return {
                x: start.x,
                y:
                    point.y < orderedY[0].y + spacing
                        ? orderedY[0].y + spacing
                        : point.y > orderedY[1].y - (widthConstraint || 0)
                        ? orderedY[1].y - (widthConstraint || 0)
                        : point.y,
            };
        }
        if (start.y === end.y) {
            if (widthConstraint && widthConstraint > Math.abs(end.x - start.x)) return false;
            return {
                x:
                    point.x < orderedX[0].x + spacing
                        ? orderedX[0].x + spacing
                        : point.x > orderedX[1].x - (widthConstraint || 0)
                        ? orderedX[1].x - (widthConstraint || 0)
                        : point.x,
                y: start.y,
            };
        }
        return { x: 0, y: 0 };
    };
    // endregion

    const onMouseMove = ({ evt: { layerX: currentX, layerY: currentY } }: KonvaEventObject<FixedMouseEvent>) => {
        const currentPosition = { x: currentX, y: currentY };
        if (!addDoorMode) return;
        if (doorRelativeToRoom) return;
        const curCorners = getCornersCoords(dimensions, position);
        const sideClosestPoints = curCorners.map((corner, cornerIndex) => {
            const segment = {
                start: curCorners[cornerIndex],
                end: curCorners[cornerIndex === corners.length - 1 ? 0 : cornerIndex + 1],
            };
            const closestPoint = closestOnSegment(currentPosition, segment, doorSize * spacing);
            const distanceToPoint =
                closestPoint !== false ? Math.hypot(currentPosition.x - closestPoint.x, currentPosition.y - closestPoint.y) : false;
            return {
                distanceToPoint: distanceToPoint || 0,
                point: closestPoint || { x: 0, y: 0 },
                index: cornerIndex,
                doorFits: !(closestPoint === false || distanceToPoint === false),
            };
        });
        const removedToShort = sideClosestPoints.filter(cur => cur.doorFits);
        const closestPoint = removedToShort.sort((a, b) => {
            return a.distanceToPoint - b.distanceToPoint;
        })[0];
        setDoorRotation(closestPoint.index % 2 === 0 ? 'hor' : 'ver');
        setDoorPositionState({
            x: closestPoint.point.x - halfSpacing,
            y: closestPoint.point.y - halfSpacing,
        });
    };

    const getDragBounds = (draggedPosition: Vector2): Vector2 => {
        if (shapeIntersects(draggedPosition)) {
            const shapePos = unitToCoordinate(position);
            shape.current?.position({
                x: shapePos.x,
                y: shapePos.y,
            });
            return unitToCoordinate(position);
        }
        return draggedPosition;
    };

    const coordPosition = unitToCoordinate(position);
    return (
        // <BuildStageContext.Consumer>
        //     {buildStageContext => (
        <AppInfoContext.Consumer>
            {appInfo => {
                return (
                    <Group
                        onMouseMove={onMouseMove}
                        key={`Room-${name}`}
                        ref={group}
                        onContextMenu={() => {
                            setSelectedRoomName(name);
                            appInfo.setContextMenuStatus(Item.room);
                        }}
                    >
                        {appInfo.selectedTool === Tool.Selector ? (
                            <Line
                                name={name}
                                ref={line}
                                key={`LINE-${name}`}
                                points={pointToArray(corners)}
                                strokeWidth={spacing}
                                closed
                                onClick={() => setSelectedRoomName(name)}
                                lineCap={'square'}
                                stroke={'black'}
                                fill={'white'}
                            />
                        ) : (
                            <Group>
                                <Rect
                                    x={backgroundPosition.x + position.x * spacing - spacing * 2}
                                    y={backgroundPosition.y + position.y * spacing - spacing * 2}
                                    height={dimensions.height * spacing + spacing * 2}
                                    width={dimensions.width * spacing + spacing * 2}
                                    fill={'black'}
                                    name={name}
                                />
                                <Rect
                                    ref={shape}
                                    x={backgroundPosition.x + position.x * spacing - spacing}
                                    y={backgroundPosition.y + position.y * spacing - spacing}
                                    draggable
                                    onMouseDown={() => setSelectedRoomName(name)}
                                    onDragMove={e => onDrag(e)}
                                    dragBoundFunc={pos => getDragBounds(pos)}
                                    height={dimensions.height * spacing}
                                    width={dimensions.width * spacing}
                                    fill={'white'}
                                />
                            </Group>
                        )}
                        {corners.map(({ x: cornerX, y: cornerY }, cornerIndex) => (
                            <Group
                                key={`ANCHOR-${cornerIndex}`}
                                name={`ANCHOR-${cornerIndex}`}
                                x={cornerX - spacing / 2}
                                y={cornerY - spacing / 2}
                                draggable
                                onDragMove={(event: KonvaEventObject<FixedDragEvent>) =>
                                    cornerResize(cornerIndex, {
                                        x: event.evt.layerX,
                                        y: event.evt.layerY,
                                    })
                                }
                                onDragEnd={() => updateShape(corners)}
                                visible={appInfo.selectedTool === Tool.Selector && appInfo.selectedRoomName === name}
                                onMouseEnter={() => setCursorChecked(index % 2 === 0 ? 'nw-resize' : 'nesw-resize')}
                                onMouseLeave={() => setCursorChecked('default')}
                            >
                                <Rect name={`ANCHOR-${index}-0`} fill={'black'} height={10} width={10} />
                                <Rect x={1} y={1} fill={'white'} height={8} width={8} />
                            </Group>
                        ))}
                        {transformBarInfo.map(({ x: transformBarX, y: transformBarY, height: barHeight, width: barWidth }, barIndex) =>
                            appInfo.selectedTool === Tool.Selector ? (
                                <Rect
                                    key={`TRANSFORM-${name}-${barIndex}`}
                                    x={transformBarX}
                                    y={transformBarY}
                                    height={barHeight}
                                    width={barWidth}
                                    draggable
                                    dragBoundFunc={pos => {
                                        return {
                                            x: barIndex % 2 === 0 ? transformBarX : pos.x,
                                            y: barIndex % 2 === 0 ? pos.y : transformBarY,
                                        };
                                    }}
                                    onMouseEnter={() => setCursorChecked(barIndex % 2 === 0 ? 'n-resize' : 'e-resize')}
                                    onMouseLeave={() => setCursorChecked('default')}
                                    onDragMove={(event: KonvaEventObject<FixedDragEvent>) => {
                                        if (appInfo.selectedTool !== Tool.Selector || appInfo.selectedRoomName !== name) return;
                                        sideResize(barIndex, event);
                                    }}
                                />
                            ) : null,
                        )}
                        {doorPositionState ? (
                            <Group visible={addDoorMode || doorRelativeToRoom !== null}>
                                <Rect
                                    name={`DOOR-${name}`}
                                    x={doorRelativeToRoom ? doorRelativeToRoom.x + coordPosition.x : doorPositionState.x}
                                    y={doorRelativeToRoom ? doorRelativeToRoom.y + coordPosition.y : doorPositionState.y}
                                    fill={'white'}
                                    width={doorRotation === 'hor' ? doorSize * spacing : spacing}
                                    height={doorRotation === 'hor' ? spacing : doorSize * spacing}
                                />
                                <Rect
                                    x={doorRelativeToRoom ? doorRelativeToRoom.x + coordPosition.x + 1 : doorPositionState.x + 1}
                                    y={doorRelativeToRoom ? doorRelativeToRoom.y + coordPosition.y + 1 : doorPositionState.y + 1}
                                    fill={'white'}
                                    width={doorRotation === 'hor' ? doorSize * spacing - 2 : spacing - 2}
                                    height={doorRotation === 'hor' ? spacing - 2 : doorSize * spacing - 2}
                                    strokeWidth={1}
                                    stroke={'black'}
                                    dash={[1, 1]}
                                />
                            </Group>
                        ) : null}
                    </Group>
                );
            }}
        </AppInfoContext.Consumer>
        //     )}
        // </BuildStageContext.Consumer>
    );
};

export default Room;
