import React from 'react';

import { Group, Rect } from 'react-konva';
import Konva from 'konva';
import { AppInfoContext } from '../../Context';
import { FixedDragEvent } from '../../Types';
import KonvaEventObject = Konva.KonvaEventObject;

type Props = {
    index: number;
    name: string;
    x: number;
    y: number;
    onDragMove: (event: KonvaEventObject<FixedDragEvent>) => void;
    onDragEnd: () => void;
};

export const AnchorPoint = ({ index, name, x, y, onDragMove, onDragEnd }: Props): JSX.Element => (
    <AppInfoContext.Consumer>
        {appInfo => (
            <Group
                name={name}
                onDragMove={(evt: KonvaEventObject<FixedDragEvent>) => onDragMove(evt)}
                onDragEnd={() => onDragEnd()}
                key={`${index}_key_${name}`}
                x={x}
                y={y}
                draggable
                onMouseEnter={() => appInfo.setCursor(index % 2 === 0 ? 'nw-resize' : 'nesw-resize')}
                onMouseLeave={() => appInfo.setCursor('default')}
            >
                <Rect name={`${name}-0`} fill={'black'} height={10} width={10} />
                <Rect name={`${name}-1`} x={1} y={1} fill={'white'} height={8} width={8} />
            </Group>
        )}
    </AppInfoContext.Consumer>
);

export default AnchorPoint;
