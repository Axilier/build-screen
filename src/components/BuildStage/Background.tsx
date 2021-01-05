import Konva from "konva";
import * as React from 'react';
import {Group, Line, Rect} from "react-konva";
import {FixedMouseEvent} from "../../Types";
import KonvaEventObject = Konva.KonvaEventObject;

interface Props {
    screenWidth: number,
    screenHeight: number,
    x?: number,
    y?: number,
    onMouseDown?: (event: KonvaEventObject<FixedMouseEvent>) => void
    onMouseMove: (event: KonvaEventObject<FixedMouseEvent>) => void
    onMouseUp: (event: KonvaEventObject<FixedMouseEvent>) => void
}

export default function Background({screenWidth, screenHeight, x, y, onMouseDown, onMouseMove, onMouseUp}: Props) {
    const image = new window.Image();
    const height = 600
    const width = 950
    const spacing = 10

    const lines: Array<Array<number>> = []
    for (let i = 0; i <= width / spacing; i++) {
        lines.push([Math.round(i * spacing), 0, Math.round(i * spacing), height])
    }
    for (let i = 0; i <= height / spacing; i++) {
        lines.push([0, Math.round(i * spacing), width, Math.round(i * spacing)])
    }

    return (
        <Group
            onMouseDown={(event: KonvaEventObject<FixedMouseEvent>) => {
                (onMouseDown) ? onMouseDown(event) : null
            }}
            onMouseMove={(event: KonvaEventObject<FixedMouseEvent>) => onMouseMove(event)}
            onMouseUp={(event: KonvaEventObject<FixedMouseEvent>) => onMouseUp(event)}
            name={"BACKGROUND"}
            x={(screenWidth / 2) - (width / 2)}
            y={(screenHeight / 2) - (height / 2)}
            height={height}
            width={width}
        >
            <Rect height={height}
                  width={width} fill={"white"}/>
            {
                lines.map((el, index) => <Line key={`BACKGROUND-LINE-${index}`} points={el} strokeWidth={0.5}
                                               stroke={"#A9A9A9"}/>)
            }
        </Group>
    )
}
