import { ShapeInfo, Vector2 } from '../../Types';
export declare const roundCoordinate: (point: Vector2, backgroundPosition: Vector2, spacing: number) => Vector2;
export declare const getRoundedUnit: (coordinate: Vector2, backgroundPosition: Vector2, spacing: number) => Vector2;
export declare const getShapeInfo: (points: Array<Vector2>, spacing: number, offset?: Vector2 | undefined) => ShapeInfo;
export declare const reOrderPoints: (points: Array<Vector2>) => Array<Vector2>;
