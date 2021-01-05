export declare type FixedMouseEvent = {
    layerX: number;
    layerY: number;
} & MouseEvent;
export declare type FixedDragEvent = {
    layerX: number;
    layerY: number;
} & DragEvent;
export interface Vector2 {
    x: number;
    y: number;
}
export interface Dimension {
    height: number;
    width: number;
}
export declare enum Item {
    room = 0,
    stage = 1
}
export declare enum Tool {
    null = 0,
    Cursor = 1,
    Selector = 2,
    Add = 3,
    drawShape = 4,
    Text = 5,
    delete = 6
}
export declare enum SubTool {
    null = 0,
    AddDoor = 1
}
export declare type TransformBar = {
    height: number;
    width: number;
} & Vector2;
export interface ShapeInfo {
    width: number;
    height: number;
    x: number;
    y: number;
}
export interface Room {
    name: string;
    x: number;
    y: number;
    height: number;
    width: number;
    doorPosition?: Vector2 | null;
}
