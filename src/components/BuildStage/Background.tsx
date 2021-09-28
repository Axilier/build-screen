import Konva from 'konva';
import * as React from 'react';
import { Group, Line, Rect } from 'react-konva';
import { useContext, useEffect } from 'react';
import { FixedMouseEvent } from '../../Types';
import { BuildStageContext } from '../../Context';
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

export const Background = ({ height, width, screenWidth, screenHeight, x, y, onMouseDown, onMouseMove, onMouseUp }: Props) => {
    const spacing = 10;
    const { setBackgroundPosition } = useContext(BuildStageContext);
    const lines: Array<Array<number>> = [];
    for (let i = 0; i <= width / spacing; i += 1) {
        lines.push([Math.round(i * spacing), 0, Math.round(i * spacing), height]);
    }
    for (let i = 0; i <= height / spacing; i += 1) {
        lines.push([0, Math.round(i * spacing), width, Math.round(i * spacing)]);
    }

    useEffect(() => {
        setBackgroundPosition({
            x: screenWidth / 2 - width / 2,
            y: screenHeight / 2 - height / 2,
        });
    }, [screenWidth, screenHeight, width, height, setBackgroundPosition]);

    return (
        <Group
            onMouseDown={(event: KonvaEventObject<FixedMouseEvent>) => {
                if (onMouseDown) onMouseDown(event);
            }}
            onMouseMove={(event: KonvaEventObject<FixedMouseEvent>) => onMouseMove(event)}
            onMouseUp={(event: KonvaEventObject<FixedMouseEvent>) => onMouseUp(event)}
            name={'BACKGROUND'}
            x={screenWidth / 2 - width / 2}
            y={screenHeight / 2 - height / 2}
            height={height}
            width={width}
        >
            <Rect height={height} width={width} fill={'grey'} />
            {lines.map((el, index) => (
                <Line key={`BACKGROUND-LINE-${index}`} points={el} strokeWidth={0.5} stroke={'#A9A9A9'} />
            ))}
        </Group>
    );
};

Background.defaultProps = {
    x: 0,
    y: 0,
    onMouseDown: () => null,
};

export default Background;
