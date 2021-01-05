import * as React from 'react';
import {useContext, useEffect, useRef, useState} from 'react';
import {Group, Line, Rect} from "react-konva";
import {AppInfoContext, BuildStageContext} from "../../Context";
import {Dimension, FixedDragEvent, Item, Room, ShapeInfo, SubTool, Tool, TransformBar, Vector2} from "../../Types";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

const spacing = 10
const halfSpacing = spacing / 2

export default function Room({index, name, x, y, height, width, doorPosition}: Room & { index: number }) {
    const shape = useRef<Konva.Rect>(null)
    const line = useRef<Konva.Line>(null)
    const group = useRef<Konva.Group>(null)
    const backgroundPos = group.current?.getStage()?.findOne('.BACKGROUND').getPosition() || {x: 0, y: 0}

    const {selectedTool, setCursor, selectedSubTool, selectedShapeName, setSelectedShapeName, setRoomList, roomList} = useContext(AppInfoContext)
    const {mousePosition} = useContext(BuildStageContext)

    const [backgroundPosition, setBackgroundPosition] = useState(backgroundPos)
    const [dimensions, setDimensions] = useState<Dimension>({height, width})
    const [position, setPosition] = useState<Vector2>({x, y})
    const [corners, setCorners] = useState<Array<Vector2>>(() => getCorners(dimensions, position))
    const [transformBarInfo, setTransformBarInfo] = useState(() => getTransformBarInfo(corners))
    const [doorPositionState, setDoorPositionState] = useState<Vector2 | null>(doorPosition || null)
    const [addDoorMode, setAddDoorMode] = useState(false)

    useEffect(() => {
        const corners = getCorners({height, width}, {x, y})
        setDimensions({height, width})
        setPosition({x, y})
        setTransformBarInfo(getTransformBarInfo(corners))
        setCorners(corners)
    }, [x, y, height, width])
    useEffect(() => {
        if (!addDoorMode) return;
        onMouseMove(mousePosition)
    }, [mousePosition])
    useEffect(() => {
        const corners = getCorners({height, width}, {x, y}, backgroundPos)
        setBackgroundPosition(backgroundPos)
        setTransformBarInfo(getTransformBarInfo(corners))
        setCorners(corners)
    }, [backgroundPos.x, backgroundPos.y])
    useEffect(() => updateRoomList(), [position, dimensions])
    useEffect(() => setAddDoorMode(selectedSubTool === SubTool.AddDoor), [selectedSubTool])


    function updateRoomList() {
        const tempRoomList = [...roomList]
        tempRoomList[index] = {
            name,
            x: position.x,
            y: position.y,
            height: dimensions.height,
            width: dimensions.width,
            doorPosition: tempRoomList[index].doorPosition
        }
        setRoomList(tempRoomList)
    }

    //NOTE Ran at the start to get the corner points from the dimensions
    function getCorners(dim: Dimension, pos: Vector2, backPos?: Vector2): Array<Vector2> {
        const backgroundPosOrState = backPos || backgroundPosition
        const halfSpacing = spacing / 2
        const {width, height} = {width: dim.width * spacing, height: dim.height * spacing}
        const {x, y} = {x: (pos.x * spacing) + backgroundPosOrState.x, y: (pos.y * spacing) + backgroundPosOrState.y}
        return [
            {x: x - halfSpacing, y: y - halfSpacing},
            {x: x + width + halfSpacing, y: y - halfSpacing},
            {x: x + width + halfSpacing, y: y + height + halfSpacing},
            {x: x - halfSpacing, y: y + height + halfSpacing}
        ]
    }

    function pointToArray(pointList: Array<Vector2>): Array<number> {
        return pointList.reduce((total, el) => {
            total.push(el.x)
            total.push(el.y)
            return total
        }, [] as Array<number>)
    }

    function onClick() {
        setSelectedShapeName(name)
    }

    function cornerResize(cornerIndex: number, newPosition: Vector2) {
        const tempCornersWithStroke = [...corners]
        const newPositionRounded = roundCoordinate(newPosition) || newPosition
        const effectedCornerBehind = (cornerIndex === 0) ? corners.length - 1 : cornerIndex - 1
        const effectedCornerAhead = (cornerIndex + 1 === corners.length) ? 0 : cornerIndex + 1
        if (effectedCornerBehind % 2 === 0) {
            tempCornersWithStroke[effectedCornerBehind].y = (newPositionRounded.y) + halfSpacing
        } else {
            tempCornersWithStroke[effectedCornerBehind].x = newPositionRounded.x + halfSpacing
        }
        if (effectedCornerAhead % 2 === 0) {
            tempCornersWithStroke[effectedCornerAhead].x = newPositionRounded.x + halfSpacing
        } else {
            tempCornersWithStroke[effectedCornerAhead].y = newPositionRounded.y + halfSpacing
        }
        tempCornersWithStroke[cornerIndex] = {
            x: newPositionRounded.x + halfSpacing,
            y: newPositionRounded.y + halfSpacing
        }
        group.current?.findOne(`.ANCHOR-${cornerIndex}`).position(newPositionRounded)
        line.current?.setAttr('points', tempCornersWithStroke)
        setCorners(tempCornersWithStroke)
    }

    function unitToCoordinate(position: Vector2): Vector2 {
        const background = group.current?.getStage()?.findOne('.BACKGROUND')
        if (!background) return position;
        const {x, y} = background.position()
        return {
            x: (position.x * spacing) + x,
            y: (position.y * spacing) + y,
        }
    }

    function roundCoordinate(point: Vector2): Vector2 {
        return {
            x: (Math.round((point.x - backgroundPosition.x) / spacing) * spacing) + backgroundPosition.x,
            y: (Math.round((point.y - backgroundPosition.y) / spacing) * spacing) + backgroundPosition.y
        }
    }

    //NOTE DOES NOT WORK WITH CONVEX SHAPES -- this is not needed for squares add it later if needed
    function reorderPoints(points: Array<number> | Array<Vector2>): Array<Vector2> {
        const pointsObjects: Array<Vector2> = []
        if (typeof points[0] === "number") {
            for (let i = 0; i <= points.length - 1; i += 2) {

                pointsObjects.push({
                    x: points[i] as number,
                    y: points[i + 1] as number
                })
            }
        } else {
            pointsObjects.push(...points as Array<Vector2>)
        }
        pointsObjects.sort((a, b) => {
            if (a.x === b.x) {
                return a.y - b.y
            } else {
                return a.x - b.x
            }
        })
        return [
            pointsObjects[0],
            pointsObjects[2],
            pointsObjects[3],
            pointsObjects[1]
        ]
    }

    function sideResize(sideIndex: number, event: KonvaEventObject<FixedDragEvent>) {
        const tempCorners = [...corners]
        const affectedCorners = [sideIndex, (sideIndex + 1 === corners.length) ? 0 : sideIndex + 1]
        const roundedCoordinate = roundCoordinate({x: event.evt.layerX, y: event.evt.layerY})
        if (!roundedCoordinate) return;
        if (sideIndex % 2 === 0) {
            tempCorners[affectedCorners[0]].y = roundedCoordinate.y - halfSpacing
            tempCorners[affectedCorners[1]].y = roundedCoordinate.y - halfSpacing
        } else {
            tempCorners[affectedCorners[0]].x = roundedCoordinate.x - halfSpacing
            tempCorners[affectedCorners[1]].x = roundedCoordinate.x - halfSpacing
        }
        line.current?.getStage()?.findOne(`.${name}`).setAttr('points', pointToArray(tempCorners))
        updateShape(tempCorners)
    }

    function updateShape(inputCorners?: Array<Vector2> | null) {
        const pointsOrdered = reorderPoints(inputCorners || getCorners(dimensions, position))
        const shapeInfo = getShapeInfo(pointsOrdered, backgroundPosition)
        setDimensions({
            width: shapeInfo.width,
            height: shapeInfo.height
        })
        setPosition({
            x: shapeInfo.x,
            y: shapeInfo.y
        })
        setTransformBarInfo(getTransformBarInfo(pointsOrdered))
        setCorners(pointsOrdered)
    }

    function getTransformBarInfo(corners?: (Array<Vector2> | null)): Array<TransformBar> {
        const dimensionsAsCoord = (corners) ? getShapeInfo(corners, backgroundPosition) : dimensions
        const {height, width} = {
            height: dimensionsAsCoord.height * spacing,
            width: dimensionsAsCoord.width * spacing
        }
        const {x, y} = corners ? corners[0] : (roundCoordinate(position) || position)
        return [
            {x: (x + (width / 2)) - width * 0.30, y: y - halfSpacing, height: spacing, width: width * 0.60},
            {x: x + width + halfSpacing, y: (y + (height / 2)) - height * 0.30, height: height * 0.60, width: spacing},
            {x: (x + (width / 2)) - width * 0.30, y: y + height + halfSpacing, height: spacing, width: width * 0.60},
            {x: x - halfSpacing, y: (y + (height / 2)) - height * 0.30, height: height * 0.60, width: spacing}
        ]
    }

    function setCursorChecked(cursor: string) {
        if (selectedTool === Tool.Selector && selectedShapeName === name) {
            setCursor(cursor)
        }
    }

    function onDrag(event: KonvaEventObject<DragEvent>) {
        const {x, y} = event.target.attrs
        const background = group.current?.getStage()?.findOne('.BACKGROUND')
        if (!background) return;
        const roundedCoordinate = {
            x: Math.round((x - backgroundPosition.x) / spacing),
            y: Math.round((y - backgroundPosition.y) / spacing)
        }
        const backgroundSize = {height: background.height() / spacing, width: background.width() / spacing}
        const containedX = (roundedCoordinate.x <= 0) ? 0 :
            (roundedCoordinate.x >= (backgroundSize.width) - dimensions.width) ?
                (backgroundSize.width) - dimensions.width : roundedCoordinate.x
        const containedY = (roundedCoordinate.y <= 0) ? 0 :
            (roundedCoordinate.y >= (backgroundSize.height) - dimensions.height) ?
                (backgroundSize.height) - dimensions.height : roundedCoordinate.y
        const newCorners = getCorners(dimensions, {x: containedX, y: containedY})
        shape.current?.position({
            x: backgroundPosition.x + (containedX * spacing),
            y: backgroundPosition.y + (containedY * spacing)
        })
        line.current?.attrs('points', newCorners)
        setPosition({
            x: containedX,
            y: containedY
        })
        setTransformBarInfo(getTransformBarInfo(newCorners))
        setCorners(newCorners)
    }

    function onMouseMove(mousePosition: Vector2) {
        const doorPosition: Vector2 = {x: 0, y: 0}
        const containedX = (mousePosition.x <= position.x - spacing) ? position.x - halfSpacing :
            (mousePosition.x >= position.x + dimensions.width) ? position.x + dimensions.width + halfSpacing : mousePosition.x
        if (mousePosition.y <= position.y) {
            doorPosition.y = position.y - halfSpacing
            doorPosition.x = containedX
        } else if (mousePosition.y >= position.y + dimensions.height) {
            doorPosition.y = position.y + dimensions.height + halfSpacing
            doorPosition.x = containedX
        } else if (mousePosition.x <= position.x) {
            doorPosition.x = position.x - halfSpacing
            doorPosition.y = mousePosition.y
        } else if (mousePosition.x >= position.x + dimensions.width) {
            doorPosition.x = position.x + dimensions.width + halfSpacing
            doorPosition.y = mousePosition.y
        }
        setDoorPositionState(doorPosition)
    }

    return (
        <BuildStageContext.Consumer>
            {
                buildStageContext => (
                    <AppInfoContext.Consumer>
                        {
                            appInfo => {
                                return (
                                    <Group ref={group} onContextMenu={() => appInfo.setContextMenuStatus(Item.room)}>
                                        {
                                            (appInfo.selectedTool === Tool.Selector) ?
                                                <Line
                                                    name={name}
                                                    ref={line}
                                                    key={`LINE-${name}`}
                                                    points={pointToArray(corners)}
                                                    strokeWidth={spacing}
                                                    closed={true}
                                                    onClick={() => onClick()}
                                                    lineCap={"square"}
                                                    stroke={"black"}
                                                    fill={"white"}
                                                />
                                                :
                                                <Group>
                                                    <Rect
                                                        x={backgroundPosition.x + (position.x * spacing) - spacing}
                                                        y={backgroundPosition.y + (position.y * spacing) - spacing}
                                                        height={(dimensions.height * spacing) + (spacing * 2)}
                                                        width={(dimensions.width * spacing) + (spacing * 2)}
                                                        fill={"black"}
                                                    />
                                                    <Rect
                                                        ref={shape}
                                                        x={backgroundPosition.x + (position.x * spacing)}
                                                        y={backgroundPosition.y + (position.y * spacing)}
                                                        name={name}
                                                        draggable
                                                        onClick={() => onClick()}
                                                        onDragMove={e => onDrag(e)}
                                                        height={dimensions.height * spacing}
                                                        width={dimensions.width * spacing}
                                                        fill={"white"}
                                                    />
                                                </Group>

                                        }
                                        {
                                            corners.map(({x, y}, index) =>
                                                <Group
                                                    name={`ANCHOR-${index}`}
                                                    x={corners[index].x - spacing / 2}
                                                    y={corners[index].y - spacing / 2}
                                                    draggable
                                                    onDragMove={(event: KonvaEventObject<FixedDragEvent>) =>
                                                        cornerResize(index, {
                                                            x: event.evt.layerX,
                                                            y: event.evt.layerY
                                                        })
                                                    }
                                                    onDragEnd={() => updateShape(corners)}
                                                    visible={appInfo.selectedTool === Tool.Selector && appInfo.selectedShapeName === name}
                                                    onMouseEnter={() => setCursorChecked((index % 2 === 0) ? "nw-resize" : "nesw-resize")}
                                                    onMouseLeave={() => setCursorChecked("default")}
                                                >

                                                    <Rect
                                                        name={`ANCHOR-${index}-0`}
                                                        fill={"black"}
                                                        height={10}
                                                        width={10}
                                                    />
                                                    <Rect
                                                        x={1}
                                                        y={1}
                                                        fill={"white"}
                                                        height={8}
                                                        width={8}
                                                    />
                                                </Group>
                                            )
                                        }
                                        {

                                            transformBarInfo.map(({x, y, height, width}, index) =>
                                                (appInfo.selectedTool === Tool.Selector) ?
                                                    <Rect x={x} y={y} height={height} width={width}
                                                          key={`TRANSFORM-${index}`}
                                                          draggable
                                                          dragBoundFunc={(pos) => {
                                                              return {
                                                                  x: (index % 2 === 0) ? x : pos.x,
                                                                  y: (index % 2 === 0) ? pos.y : y,
                                                              }
                                                          }}
                                                          onMouseEnter={() => setCursorChecked((index % 2 === 0) ? "n-resize" : "e-resize")}
                                                          onMouseLeave={() => setCursorChecked("default")}
                                                          onDragMove={(event: KonvaEventObject<FixedDragEvent>) => {
                                                              if (appInfo.selectedTool !== Tool.Selector || appInfo.selectedShapeName !== name) return;
                                                              sideResize(index, event)
                                                          }}
                                                    /> : null
                                            )
                                        }
                                        {
                                            (doorPositionState) ?
                                                (
                                                    <Rect
                                                        name={`DOOR-${name}`}
                                                        x={doorPositionState.x - halfSpacing}
                                                        y={doorPositionState.y - halfSpacing}
                                                        fill={"white"}
                                                        width={spacing}
                                                        height={spacing}
                                                    />
                                                ) : null
                                        }

                                    </Group>
                                )
                            }
                        }
                    </AppInfoContext.Consumer>
                )
            }
        </BuildStageContext.Consumer>
    )
}

/*
    NOTE takes points in as pixels/konva units converts it into the square units
    NOTE Offset will take away the value provided from the position, this allows for making position relative to background
 */
export function getShapeInfo(points: Array<Vector2>, offset?: Vector2): ShapeInfo {
    return {
        width: (Math.abs(points[0].x - points[1].x) - spacing) / spacing,
        height: (Math.abs(points[1].y - points[2].y) - spacing) / spacing,
        x: (points[0].x + halfSpacing - (offset?.x || 0)) / spacing,
        y: (points[0].y + halfSpacing - (offset?.y || 0)) / spacing
    }
}
