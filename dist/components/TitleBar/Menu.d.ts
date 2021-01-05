/// <reference types="react" />
import '../../css/DropMenu.css';
import { MenuTileType } from "./MenuTile";
export interface MenuType {
    open: boolean;
    menuTiles: Array<MenuTileType>;
    color: string;
    tileHoverColor?: string;
    width?: number;
    backgroundColor?: string;
}
export default function Menu({ open, menuTiles, color, tileHoverColor, width, backgroundColor }: MenuType): JSX.Element;
