/// <reference types="react" />
import { MenuTileType } from "./MenuTile";
export interface BasicProps {
    backgroundColor: string;
    hoveredColor: string;
    color: string;
    menuTileTextColor?: string;
    menuTileHoverColor?: string;
}
export interface TitleBarTileType {
    name: string;
    menuLayout: Array<MenuTileType>;
}
export default function TitleBarTile({ name, backgroundColor, hoveredColor, color, menuLayout, menuTileTextColor, menuTileHoverColor }: TitleBarTileType & BasicProps): JSX.Element;
