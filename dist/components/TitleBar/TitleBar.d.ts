/// <reference types="react" />
import '../../css/TitleBar.css';
import { BasicProps, TitleBarTileType } from "./TitleBarTile";
interface TitleBarProps {
    TileList: Array<TitleBarTileType>;
}
export default function TitleBar({ TileList, backgroundColor, color, hoveredColor, menuTileTextColor, menuTileHoverColor }: TitleBarProps & BasicProps): JSX.Element;
export {};
