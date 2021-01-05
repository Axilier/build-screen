import * as React from 'react';
import {useState} from 'react';
import Menu from "./Menu";
import {MenuTileType} from "./MenuTile";

export interface BasicProps {
    backgroundColor: string,
    hoveredColor: string
    color: string
    menuTileTextColor?: string
    menuTileHoverColor?: string
}

export interface TitleBarTileType {
    name: string,
    menuLayout: Array<MenuTileType>
}

export default function TitleBarTile({name, backgroundColor, hoveredColor, color, menuLayout,menuTileTextColor, menuTileHoverColor}: TitleBarTileType & BasicProps) {
    const [menuOpen, setMenuStatus] = useState(false)
    const [hovered, setHovered] = useState(false)

    window.addEventListener("click",(event:MouseEvent)=> {
        // @ts-ignore
        if(event.target.className === "titlebar-tile" && event.target.id === `titlebar-tile-${name}`) return
        setMenuStatus(false)
    })

    return (
        <div onClick={() => setMenuStatus(!menuOpen)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => {
            setHovered(false)
        }} className={"titlebar-tile"} id={`titlebar-tile-${name}`}
             style={{color, backgroundColor: (hovered) ? hoveredColor : backgroundColor}}>
            {name}
            <Menu open={menuOpen} menuTiles={menuLayout} color={menuTileTextColor || color} tileHoverColor={menuTileHoverColor}/>
        </div>
    )
};
