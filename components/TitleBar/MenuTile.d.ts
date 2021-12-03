import * as React from 'react';
export interface MenuTileType {
    isDivider?: boolean;
    name: string;
    shortcut?: string;
    onClick?: () => void;
    hoverColor?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
}
export declare const MenuTile: ({ hoverColor, backgroundColor, onClick, name, shortcut, isDivider, children }: MenuTileType) => JSX.Element;
export default MenuTile;
