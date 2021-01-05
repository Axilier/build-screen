export type FixedMouseEvent = {
    layerX: number,
    layerY: number
} & MouseEvent;

export type FixedDragEvent = {
    layerX: number,
    layerY: number
} & DragEvent

export interface Vector2 {
    x: number,
    y: number
}

export interface Dimension {
    height: number,
    width: number
}

export enum Item {
    room,
    stage
}

export enum Tool {
    null,
    Cursor,
    Selector,
    Add,
    drawShape,
    Text,
    delete
}
 export enum SubTool {
    null,
    AddDoor
 }

enum ShapeType {
    Room
}

type Shape = {
    name: string
    type: ShapeType.Room
}

export type TransformBar = {
    height: number
    width: number
} & Vector2

export interface ShapeInfo {
    width: number,
    height: number,
    x: number,
    y: number
}

 export interface Room {
     name: string
     x: number, // Top left of the room
     y: number, // Top left of the room
     height: number,
     width: number,
     doorPosition?: Vector2 | null
 }
