/// <reference types="react" />
import Konva from "konva";
import { FixedDragEvent } from "../../Types";
import KonvaEventObject = Konva.KonvaEventObject;
declare type Props = {
    index: number;
    name: string;
    x: number;
    y: number;
    onDragMove: (event: KonvaEventObject<FixedDragEvent>) => void;
    onDragEnd: () => void;
    show: boolean;
};
export default function AnchorPoint({ index, name, x, y, onDragMove, onDragEnd, show }: Props): JSX.Element;
export {};
