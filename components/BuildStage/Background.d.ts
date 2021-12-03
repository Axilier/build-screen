/// <reference types="react" />
import Konva from 'konva';
import { FixedMouseEvent } from '../../Types';
import KonvaEventObject = Konva.KonvaEventObject;
interface Props {
    height: number;
    width: number;
    screenWidth: number;
    screenHeight: number;
    x?: number;
    y?: number;
    onMouseDown?: (event: KonvaEventObject<FixedMouseEvent>) => void;
    onMouseMove: (event: KonvaEventObject<FixedMouseEvent>) => void;
    onMouseUp: (event: KonvaEventObject<FixedMouseEvent>) => void;
}
export declare const Background: {
    ({ height, width, screenWidth, screenHeight, x, y, onMouseDown, onMouseMove, onMouseUp }: Props): JSX.Element;
    defaultProps: {
        x: number;
        y: number;
        onMouseDown: () => null;
    };
};
export default Background;
