import * as React from 'react';
import { useState } from 'react';
import styles from '../../css/Menu.module.css';
import Menu, { menuContext } from './Menu';

export interface MenuTileType {
    isDivider?: boolean;
    name: string;
    shortcut?: string;
    onClick?: () => void;
    hoverColor?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
}

export const MenuTile = ({ hoverColor, backgroundColor, onClick, name, shortcut, isDivider, children }: MenuTileType): JSX.Element => {
    const [hovered, setHovered] = useState(false);

    return isDivider ? (
        <div className={'divider'} />
    ) : (
        <menuContext.Consumer>
            {info => (
                <>
                    <div
                        role={'button'}
                        style={{
                            backgroundColor: hovered ? info.tileHoveredColor || hoverColor || '#F5F5F5' : backgroundColor || 'transparent',
                        }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className={styles.tile}
                        onClick={() => {
                            if (onClick) onClick();
                        }}
                    >
                        <div>{name}</div>
                        {shortcut ? <div>{shortcut}</div> : <></>}
                    </div>
                    {children ? (
                        <Menu
                            open={hovered}
                            style={{
                                left: info.width,
                                marginTop: '-30px',
                                borderRadius: '0px 4px 4px 4px',
                            }}
                            width={info.width}
                            backgroundColor={info.backgroundColor}
                            tileHoveredColor={info.tileHoveredColor}
                        >
                            {children}
                        </Menu>
                    ) : null}
                </>
            )}
        </menuContext.Consumer>
    );
};

export default MenuTile;
