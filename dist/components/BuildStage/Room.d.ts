/// <reference types="react" />
import { Room, ShapeInfo, Vector2 } from "../../Types";
export default function Room({ index, name, x, y, height, width, doorPosition }: Room & {
    index: number;
}): JSX.Element;
export declare function getShapeInfo(points: Array<Vector2>, offset?: Vector2): ShapeInfo;
