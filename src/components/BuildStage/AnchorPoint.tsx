import * as React from 'react';
import {Group, Rect} from "react-konva";
import Konva from "konva";
import {FixedDragEvent, Vector2} from "../../Types";
import KonvaEventObject = Konva.KonvaEventObject;
import {useEffect, useState} from "react";

type Props = {
    index: number
    name: string
    x: number,
    y: number,
    onDragMove: (event: KonvaEventObject<FixedDragEvent>) => void,
    onDragEnd: () => void
    // onMouseEnter?: () => void,
    // onMouseLeave?: () => void,
    show: boolean
}

export default function AnchorPoint({index, name, x, y, onDragMove, onDragEnd, show}: Props) {
    const [position,setPosition] = useState<Vector2>({x,y})
    useEffect(() => setPosition({x,y}),[x,y])

    return (
        <Group
            name={name}
            onDragMove={(evt: KonvaEventObject<FixedDragEvent>) => onDragMove(evt)}
            onDragEnd={() => onDragEnd()}
            key={`${x}_key_${y}`}
            x={position.x}
            y={position.y}
            draggable
            visible={show}
            // onMouseEnter={() => {
            //     if (!onMouseEnter) return;
            //     onMouseEnter()
            // }}
            // onMouseLeave={() => {
            //     if (!onMouseLeave) return;
            //     onMouseLeave()
            // }}
        >
            <Rect
                name={`${name}-0`}
                fill={"black"}
                height={10}
                width={10}
            />
            <Rect
                name={`${name}-1`}
                x={1}
                y={1}
                fill="white"
                height={8}
                width={8}
            />
        </Group>
    )
}
