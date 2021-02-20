/** @format */

import { ShapeInfo, Vector2 } from '../../Types';

// DOC Returns konva coordinate not Axilier unit
export function roundCoordinate(
    point: Vector2,
    backgroundPosition: Vector2,
    spacing: number,
): Vector2 {
    return {
        x:
            Math.round((point.x - backgroundPosition.x) / spacing) * spacing +
            backgroundPosition.x,
        y:
            Math.round((point.y - backgroundPosition.y) / spacing) * spacing +
            backgroundPosition.y,
    };
}

export function getRoundedUnit(
    coordinate: Vector2,
    backgroundPosition: Vector2,
    spacing: number,
): Vector2 {
    return {
        x: Math.round((coordinate.x - backgroundPosition.x) / spacing),
        y: Math.round((coordinate.y - backgroundPosition.y) / spacing),
    };
}

/*
    NOTE takes points in as pixels/konva units converts it into the square units
    NOTE Offset will take away the value provided from the position, this allows for making position relative to background
 */
export function getShapeInfo(
    points: Array<Vector2>,
    spacing: number,
    offset?: Vector2,
): ShapeInfo {
    const halfSpacing = spacing / 2;
    return {
        width: (Math.abs(points[0].x - points[1].x) - spacing) / spacing,
        height: (Math.abs(points[1].y - points[2].y) - spacing) / spacing,
        x: (points[0].x + halfSpacing - (offset?.x || 0)) / spacing,
        y: (points[0].y + halfSpacing - (offset?.y || 0)) / spacing,
    };
}
