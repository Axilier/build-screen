import * as React from 'react';
import '../../css/TitleBar.css'
import TitleBarTile, {BasicProps, TitleBarTileType} from "./TitleBarTile";

interface TitleBarProps {
    TileList: Array<TitleBarTileType>
}

export const TitleBar = ({TileList, backgroundColor, color, hoveredColor, menuTileTextColor, menuTileHoverColor}: TitleBarProps & BasicProps) => {
    return (
        <div className={"titlebar"}>
            {TileList.map(({name, menuLayout}: TitleBarTileType, index: number) => (
                <TitleBarTile key={"title-tile" + index} name={name} backgroundColor={backgroundColor} hoveredColor={hoveredColor} color={color}
                              menuLayout={menuLayout} menuTileTextColor={menuTileTextColor} menuTileHoverColor={menuTileHoverColor}/>
            ))}
        </div>
    )
}

export default TitleBar;
