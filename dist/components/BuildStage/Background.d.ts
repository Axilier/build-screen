/// <reference types="react" />
import Konva from "konva";
import { FixedMouseEvent } from "../../Types";
import KonvaEventObject = Konva.KonvaEventObject;
interface Props {
    screenWidth: number;
    screenHeight: number;
    x?: number;
    y?: number;
    onMouseDown?: (event: KonvaEventObject<FixedMouseEvent>) => void;
    onMouseMove: (event: KonvaEventObject<FixedMouseEvent>) => void;
    onMouseUp: (event: KonvaEventObject<FixedMouseEvent>) => void;
}
export default function Background({ screenWidth, screenHeight, x, y, onMouseDown, onMouseMove, onMouseUp }: Props): JSX.Element;
export {};
