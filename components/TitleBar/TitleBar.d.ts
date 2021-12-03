import * as React from 'react';
import { BasicProps } from '../../Types';
interface TitleBarProps {
    children: React.ReactNode;
}
export declare const TitleBarContext: React.Context<{
    backgroundColor: string;
    color: string;
    hoveredColor: string;
    menuTileTextColor: string;
    menuTileHoverColor: string;
}>;
declare const TitleBar: ({ children, backgroundColor, color, hoveredColor, menuTileTextColor, menuTileHoverColor, }: TitleBarProps & BasicProps) => JSX.Element;
export default TitleBar;
