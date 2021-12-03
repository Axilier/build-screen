import * as React from 'react';
import { CSSProperties } from 'react';
export interface MenuType {
    open?: boolean;
    color?: string;
    width?: number;
    backgroundColor?: string;
    children: React.ReactNode;
    tileHoveredColor?: string;
    style?: CSSProperties;
}
export declare const menuContext: React.Context<{
    tileHoveredColor: string;
    width: number;
    backgroundColor: string;
}>;
declare const Menu: ({ open, color, width, backgroundColor, children, tileHoveredColor, style }: MenuType) => JSX.Element;
export default Menu;
