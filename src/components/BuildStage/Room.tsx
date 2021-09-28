import Konva from 'konva';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Line, Rect } from 'react-konva';
import { Dimension, FixedDragEvent, Item, RoomType, SubTool, Tool, Vector2 } from '../../Types';
import { AppInfoContext, BuildStageContext } from '../../Context';
import { getShapeInfo, reOrderPoints, roundCoordinate } from './Utils';
import AnchorPoint from './AnchorPoint';
import useEventListener from '../useEventListener';
import KonvaEventObject = Konva.KonvaEventObject;

const Room = ({
    x: initX,
    y: initY,
    height: initHeight,
    width: initWidth,
    index,
    name,
    doorPosition: initDoorPosition,
}: RoomType & { index: number }): JSX.Element => {
    const group = useRef<Konva.Group>(null);
    const lineGroup = useRef<Konva.Group>(null);
    const shape = useRef<Konva.Rect>(null);
    const { spacing, roomList, setRoomList, selectedRoomName, selectedSubTool, setSelectedSubTool } = useContext(AppInfoContext);
    const { backgroundPosition, backgroundSize, mousePosition } = useContext(BuildStageContext);
    const calculateCorners = useCallback(
        (curX: number, curY: number, curHeight: number, curWidth: number, curBackgroundPosition: Vector2) => [
            {
                x: curX + curBackgroundPosition.x - spacing / 2,
                y: curY + curBackgroundPosition.y - spacing / 2,
            },
            {
                x: curX + curBackgroundPosition.x + curWidth + spacing / 2,
                y: curY + curBackgroundPosition.y - spacing / 2,
            },
            {
                x: curX + curBackgroundPosition.x + curWidth + spacing / 2,
                y: curY + curBackgroundPosition.y + curHeight + spacing / 2,
            },
            {
                x: curX + curBackgroundPosition.x - spacing / 2,
                y: curY + curBackgroundPosition.y + curHeight + spacing / 2,
            },
        ],
        [spacing],
    );

    const [height, setHeight] = useState(initHeight * spacing);
    const [width, setWidth] = useState(initWidth * spacing);
    const [x, setX] = useState(initX * spacing);
    const [y, setY] = useState(initY * spacing);
    const [doorPosition, setDoorPosition] = useState<Vector2>(initDoorPosition || { x: 0, y: 0 });
    const [doorSize, setDoorSize] = useState(4);
    const [doorRotation, setDoorRotation] = useState<'hor' | 'ver'>('hor');
    const [corners, setCorners] = useState<Array<Vector2>>(() =>
        calculateCorners(initX * spacing, initY * spacing, initHeight * spacing, initWidth * spacing, backgroundPosition),
    );

    useEffect(() => {
        setCorners([...calculateCorners(initX * spacing, initY * spacing, initHeight * spacing, initWidth * spacing, backgroundPosition)]);
    }, [backgroundPosition, setCorners, initX, initY, initHeight, initWidth, calculateCorners, spacing]);

    const updateShape = () => {
        const pointsOrdered = reOrderPoints([...corners]);
        const shapeInfo = getShapeInfo(pointsOrdered, spacing, backgroundPosition);
        setX(shapeInfo.x);
        setY(shapeInfo.y);
        setHeight(shapeInfo.height);
        setWidth(shapeInfo.width);
        const tempRoomList = [...roomList];
        tempRoomList[index] = {
            x: shapeInfo.x / spacing,
            y: shapeInfo.y / spacing,
            height: shapeInfo.height / spacing,
            width: shapeInfo.width / spacing,
            name,
        };
        setRoomList([...tempRoomList]);
    };

    const onDrag = (event: KonvaEventObject<DragEvent>) => {
        // TODO Optimise dragging costs - while you drag a shape across a layer that layer must be redrawn per cycle of the move event listener.
        //  To avoid this performance cost, move the shape to a dedicated layer while dragging, then move it back to original layer at drag end.
        const newPos = roundCoordinate(event.target.attrs, backgroundPosition, spacing);
        const contain = (dimension: number, backgroundDimension: number, vecPart: 'x' | 'y') =>
            newPos[vecPart] <= 0
                ? spacing
                : newPos[vecPart] >= backgroundDimension - dimension
                ? backgroundDimension - dimension - spacing
                : newPos[vecPart];
        const contained = {
            x: contain(width, backgroundSize.width, 'x'),
            y: contain(height, backgroundSize.height, 'y'),
        };
        const intersects = roomList.some((room, roomIndex) => {
            return roomIndex === index
                ? false
                : haveIntersection(room, { x: contained.x / spacing, y: contained.y / spacing, height: height / spacing, width: width / spacing });
        });
        if (!intersects) {
            shape.current?.position({
                x: contained.x + backgroundPosition.x,
                y: contained.y + backgroundPosition.y,
            });
            setX(contained.x);
            setY(contained.y);
            setCorners([...calculateCorners(contained.x, contained.y, height, width, backgroundPosition)]);
            setRoomList(
                roomList.map((room, roomIndex) =>
                    roomIndex === index
                        ? {
                              ...room,
                              x: contained.x / spacing,
                              y: contained.y / spacing,
                          }
                        : room,
                ),
            );
        } else {
            shape.current?.position({
                x: x + backgroundPosition.x,
                y: y + backgroundPosition.y,
            });
        }
    };

    const onCornerDrag = (event: KonvaEventObject<FixedDragEvent>, cornerIndex: number) => {
        const roundedPos = roundCoordinate({ x: event.evt.layerX, y: event.evt.layerY }, backgroundPosition, spacing);
        const newCornerPosition = {
            x: roundedPos.x + backgroundPosition.x,
            y: roundedPos.y + backgroundPosition.y,
        };
        const cornerBehind = cornerIndex === 0 ? corners.length - 1 : cornerIndex - 1;
        const cornerAhead = cornerIndex + 1 === corners.length ? 0 : cornerIndex + 1;
        const tempCorners = corners.map((corner, tempCornerIndex) => {
            if (tempCornerIndex === cornerBehind) {
                if (cornerBehind % 2 === 0) {
                    return { x: corner.x, y: newCornerPosition.y + spacing / 2 };
                }
                return { x: newCornerPosition.x + spacing / 2, y: corner.y };
            }
            if (tempCornerIndex === cornerAhead) {
                if (cornerAhead % 2 === 0) {
                    return { x: newCornerPosition.x + spacing / 2, y: corner.y };
                }
                return { x: corner.x, y: newCornerPosition.y + spacing / 2 };
            }
            if (tempCornerIndex === cornerIndex)
                return {
                    x: newCornerPosition.x + spacing / 2,
                    y: newCornerPosition.y + spacing / 2,
                };
            return corner;
        });
        const orderedCorners = reOrderPoints(tempCorners);
        const shapeInfo = getShapeInfo(orderedCorners, spacing, backgroundPosition);
        const intersects = roomList.some((room, roomIndex) => {
            return roomIndex === index
                ? false
                : haveIntersection(room, {
                      x: shapeInfo.x / spacing,
                      y: shapeInfo.y / spacing,
                      height: shapeInfo.height / spacing,
                      width: shapeInfo.width / spacing,
                  });
        });
        if (!intersects) {
            lineGroup.current?.findOne(`.ANCHOR-${cornerIndex}`).position(newCornerPosition);
            setCorners([...tempCorners]);
        } else {
            lineGroup.current
                ?.findOne(`.ANCHOR-${cornerIndex}`)
                .position({ x: corners[cornerIndex].x - spacing / 2, y: corners[cornerIndex].y - spacing / 2 });
        }
    };

    const pointToArray = (pointList: Array<Vector2>): number[] => {
        return [...pointList].reduce((total, el) => {
            total.push(el.x);
            total.push(el.y);
            return total;
        }, [] as number[]);
    };

    const haveIntersection = (r1: Vector2 & Dimension, r2: Vector2 & Dimension) =>
        !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);

    const closestOnSegment = useCallback(
        (point: Vector2, { start, end }: { start: Vector2; end: Vector2 }, widthConstraint?: number): Vector2 | false => {
            const orderedX = [start, end].sort((a, b) => a.x - b.x);
            const orderedY = [start, end].sort((a, b) => a.y - b.y);
            const constrainedSide = (indexSelector: 'x' | 'y', orderedPoints: Array<Vector2>) => {
                return point[indexSelector] < orderedPoints[0][indexSelector] + spacing
                    ? orderedPoints[0][indexSelector] + spacing
                    : point[indexSelector] > orderedPoints[1][indexSelector] - (widthConstraint || 0)
                    ? orderedPoints[1][indexSelector] - (widthConstraint || 0)
                    : point[indexSelector];
            };
            if (start.x === end.x) {
                if (widthConstraint && widthConstraint > Math.abs(end.y - start.y) - spacing) return false;
                return {
                    x: start.x,
                    y: constrainedSide('y', orderedY),
                };
            }
            if (start.y === end.y) {
                if (widthConstraint && widthConstraint > Math.abs(end.x - start.x) - spacing) return false;
                return {
                    x: constrainedSide('x', orderedX),
                    y: start.y,
                };
            }
            return { x: 0, y: 0 };
        },
        [spacing],
    );

    const onMouseMove = useCallback(
        (curMousePosition: Vector2) => {
            if (selectedSubTool !== SubTool.AddDoor) return;
            const sideClosestPoints = corners.map((corner, cornerIndex) => {
                const closestPoint = closestOnSegment(
                    curMousePosition,
                    {
                        start: corners[cornerIndex],
                        end: corners[cornerIndex === corners.length - 1 ? 0 : cornerIndex + 1],
                    },
                    doorSize * spacing,
                );
                const distanceToPoint =
                    closestPoint !== false ? Math.hypot(curMousePosition.x - closestPoint.x, curMousePosition.y - closestPoint.y) : false;
                return {
                    distanceToPoint: distanceToPoint || 0,
                    point: closestPoint || { x: 0, y: 0 },
                    index: cornerIndex,
                    doorFits: !(closestPoint === false || distanceToPoint === false),
                };
            });
            const closestPoint = sideClosestPoints
                .filter(side => side.doorFits)
                .sort((a, b) => {
                    return a.distanceToPoint - b.distanceToPoint;
                })[0];
            setDoorRotation(closestPoint.index % 2 === 0 ? 'hor' : 'ver');
            setDoorPosition({
                x: closestPoint.point.x - spacing / 2,
                y: closestPoint.point.y - spacing / 2,
            });
        },
        [closestOnSegment, corners, doorSize, selectedSubTool, spacing],
    );

    const handleWheel = (event: WheelEvent) => {
        if (selectedRoomName !== name) return;
        if (event.deltaY < 0) {
            if (doorRotation === 'ver') {
                const bottomLeft = doorPosition.y + (doorSize + 1) * spacing;
                if (bottomLeft <= corners[2].y - spacing / 2) {
                    setDoorSize(doorSize + 1);
                }
            } else if (doorRotation === 'hor') {
                const bottomRight = doorPosition.x + (doorSize + 1) * spacing;
                if (bottomRight <= corners[1].x - spacing / 2) {
                    setDoorSize(doorSize + 1);
                }
            }
        } else {
            if (doorSize <= 1) return;
            setDoorSize(doorSize - 1);
        }
    };
    const onClick = () => {
        if (selectedRoomName !== name || selectedSubTool !== SubTool.AddDoor) return;
        setSelectedSubTool(SubTool.null);
        setRoomList(
            roomList.map((room, roomIndex) =>
                roomIndex === index
                    ? {
                          ...room,
                          doorPosition: { x: doorPosition.x - x, y: doorPosition.y - y },
                          doorSize,
                          doorRotation,
                      }
                    : room,
            ),
        );
        setDoorPosition(curPos => {
            return { x: curPos.x - x, y: curPos.y - y };
        });
    };

    useEventListener('click', onClick);
    useEventListener('wheel', handleWheel);
    useEffect(() => onMouseMove(mousePosition), [mousePosition, onMouseMove]);
    const points = useMemo(() => pointToArray(corners), [corners]);

    return (
        <AppInfoContext.Consumer>
            {appInfo => (
                <>
                    {appInfo.selectedTool === Tool.Selector && appInfo.selectedRoomName === name ? (
                        <Group ref={lineGroup}>
                            <Line name={'LINE'} points={points} strokeWidth={spacing} closed lineCap={'square'} stroke={'black'} fill={'white'} />
                            {corners.map((corner, cornerIndex) => (
                                <AnchorPoint
                                    key={`ANCHOR-${cornerIndex}`}
                                    index={cornerIndex}
                                    name={`ANCHOR-${cornerIndex}`}
                                    x={corner.x - spacing / 2}
                                    y={corner.y - spacing / 2}
                                    onDragMove={e => onCornerDrag(e, cornerIndex)}
                                    onDragEnd={() => updateShape()}
                                />
                            ))}
                        </Group>
                    ) : (
                        <Group
                            ref={group}
                            onContextMenu={() => {
                                appInfo.setSelectedRoomName(name);
                                appInfo.setContextMenuStatus(Item.room);
                            }}
                        >
                            <Rect
                                name={`${name}-Stroke`}
                                height={height + appInfo.spacing * 2}
                                width={width + appInfo.spacing * 2}
                                x={backgroundPosition.x + x - appInfo.spacing}
                                y={backgroundPosition.y + y - appInfo.spacing}
                                fill={'black'}
                            />
                            <Rect
                                name={`${name}-Fill`}
                                ref={shape}
                                x={backgroundPosition.x + x}
                                y={backgroundPosition.y + y}
                                draggable
                                onDragMove={onDrag}
                                onClick={() => appInfo.setSelectedRoomName(name)}
                                height={height}
                                width={width}
                                fill={'white'}
                            />
                            {appInfo.selectedSubTool === SubTool.AddDoor && appInfo.selectedRoomName === name ? (
                                <Rect
                                    fill={'white'}
                                    x={appInfo.selectedSubTool === SubTool.AddDoor ? doorPosition?.x : doorPosition.x + x}
                                    y={appInfo.selectedSubTool === SubTool.AddDoor ? doorPosition?.y : doorPosition.y + y}
                                    height={doorRotation === 'ver' ? spacing * doorSize : spacing}
                                    width={doorRotation === 'hor' ? spacing * doorSize : spacing}
                                    strokeWidth={1}
                                    stroke={'black'}
                                    dash={[1, 1]}
                                />
                            ) : null}
                        </Group>
                    )}
                </>
            )}
        </AppInfoContext.Consumer>
    );
};

export default Room;
