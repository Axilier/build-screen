import '../../css/DropMenu.css'
import * as React from 'react';
import {useEffect, useState} from 'react';
import MenuTile, {MenuTileType} from "./MenuTile";

export interface MenuType {
    open: boolean,
    menuTiles: Array<MenuTileType>,
    color: string,
    tileHoverColor?: string
    width?: number
    backgroundColor?: string
}

export const Menu = ({open, menuTiles, color, tileHoverColor, width, backgroundColor}: MenuType) => {

    const [status, setStatus] = useState(open)

    useEffect(() => {
        setStatus(open)
    }, [open])

    return (
        <div className={"drop-menu"}
             style={{
                 display: (status) ? "block" : "none",
                 color,
                 width: (width) ? `${width}px` : '300px',
                 backgroundColor: (backgroundColor) ? backgroundColor : 'white'
             }}>
            {menuTiles.map(({name, shortcut, onClick}: MenuTileType, index: number) => (
                <MenuTile key={name + index} name={name} shortcut={shortcut} onClick={() => {
                    setStatus(false);
                    onClick()
                }}
                          hoverColor={tileHoverColor} backgroundColor={backgroundColor}/>
            ))}
        </div>
    )
}

export default Menu;
