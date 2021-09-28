import * as React from 'react';
import { useContext, useRef, useState } from 'react';
import { useClickOutside } from 'core';
import styles from '../../css/TitleBar.module.css';
import { TitleBarContext } from './TitleBar';
import Menu from './Menu';

export interface TitleBarTileType {
    name: string;
    children: React.ReactNode;
}

export const TitleBarTile = ({ name, children }: TitleBarTileType): JSX.Element => {
    const { color, backgroundColor, hoveredColor } = useContext(TitleBarContext);
    const [menuOpen, setMenuStatus] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(() => setMenuStatus(false), ref);

    return (
        <div
            ref={ref}
            role={'button'}
            onClick={() => setMenuStatus(!menuOpen)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
            }}
            className={styles.tile}
            style={{
                color,
                backgroundColor: hovered ? hoveredColor : backgroundColor,
            }}
        >
            {name}
            <Menu open={menuOpen}>{children}</Menu>
        </div>
    );
};

export default TitleBarTile;
