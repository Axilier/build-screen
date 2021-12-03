import { Coords } from 'google-map-react';
export declare type FixedMouseEvent = {
    layerX: number;
    layerY: number;
    target: {
        className: string;
        id: string;
    };
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
export interface BasicProps {
    backgroundColor: string;
    hoveredColor: string;
    color: string;
    menuTileTextColor?: string;
    menuTileHoverColor?: string;
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
    Position = 4
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
export interface Map {
    position: Coords;
    ratios: Coords;
    rotation: number;
    scale: Vector2;
    rooms: Array<RoomType>;
}
export interface RoomType {
    name: string;
    x: number;
    y: number;
    height: number;
    width: number;
    doorPosition?: Vector2 | null;
    doorSize?: number;
    doorRotation?: 'ver' | 'hor';
}
export interface Tile {
    name: string;
    components?: null | Array<string>;
    shown: boolean;
    locked: boolean;
}
export interface Icon {
    type: 'basic' | 'highlighted';
}
