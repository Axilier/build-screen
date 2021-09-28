import { ShapeInfo, Vector2 } from '../../Types';

// DOC Returns konva coordinate not Axilier unit
export const roundCoordinate = (point: Vector2, backgroundPosition: Vector2, spacing: number): Vector2 => {
    return {
        x: Math.round((point.x - backgroundPosition.x) / spacing) * spacing,
        y: Math.round((point.y - backgroundPosition.y) / spacing) * spacing,
    };
};

export const getRoundedUnit = (coordinate: Vector2, backgroundPosition: Vector2, spacing: number): Vector2 => {
    return {
        x: Math.round((coordinate.x - backgroundPosition.x) / spacing),
        y: Math.round((coordinate.y - backgroundPosition.y) / spacing),
    };
};

/*
    NOTE takes points in as pixels/konva units converts it into the square units
    NOTE Offset will take away the value provided from the position, this allows for making position relative to background
 */
export const getShapeInfo = (points: Array<Vector2>, spacing: number, offset?: Vector2): ShapeInfo => {
    return {
        width: Math.abs(points[0].x - points[1].x) - spacing,
        height: Math.abs(points[1].y - points[2].y) - spacing,
        x: points[0].x + spacing / 2 - (offset?.x || 0),
        y: points[0].y + spacing / 2 - (offset?.y || 0),
    };
};

export const reOrderPoints = (points: Array<Vector2>): Array<Vector2> => {
    const pointsOrder = [...points].sort((a, b) => {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
    });
    return [pointsOrder[0], pointsOrder[1], pointsOrder[3], pointsOrder[2]];
};
