import * as React from 'react';
import { createContext, CSSProperties, useContext, useEffect, useState } from 'react';
import styles from '../../css/Menu.module.css';
import { TitleBarContext } from './TitleBar';

export interface MenuType {
    open?: boolean;
    color?: string;
    width?: number;
    backgroundColor?: string;
    children: React.ReactNode;
    tileHoveredColor?: string;
    style?: CSSProperties;
}

export const menuContext = createContext({
    tileHoveredColor: '',
    width: 0,
    backgroundColor: '',
});

const Menu = ({ open, color, width, backgroundColor, children, tileHoveredColor, style }: MenuType): JSX.Element => {
    const [status, setStatus] = useState(open);
    const [hovered, setHovered] = useState(false);
    const { menuTileTextColor, menuTileHoverColor } = useContext(TitleBarContext);

    useEffect(() => {
        setStatus(open);
    }, [open]);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={styles.menu}
            style={{
                ...style,
                display: status ?? hovered ? 'block' : 'none',
                color: menuTileTextColor || color,
                width: width ? `${width}px` : '300px',
                backgroundColor: backgroundColor || 'white',
            }}
        >
            <menuContext.Provider
                value={{
                    tileHoveredColor: menuTileHoverColor || tileHoveredColor || '',
                    width: width || 300,
                    backgroundColor: backgroundColor || 'white',
                }}
            >
                {children}
            </menuContext.Provider>
        </div>
    );
};

export default Menu;
