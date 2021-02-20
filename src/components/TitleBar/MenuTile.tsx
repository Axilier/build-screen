import * as React from 'react';
import {useState} from 'react';

export interface MenuTileType {
    name: string,
    shortcut: string | false,
    onClick: () => void,
    hoverColor?: string,
    backgroundColor?: string
}

export const MenuTile = (props: MenuTileType | "divider") => {
    const [hovered, setHovered] = useState(false)
    return (props === "divider") ? <div className={"divider"}/> : (
        <div
            style={{backgroundColor: (hovered) ? props.hoverColor || "#F5F5F5" : (props.backgroundColor) ? props.backgroundColor : "transparent"}}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={"dropdown-tile"}
            onClick={() => props.onClick()}>
            <div>{props.name}</div>
            {(props.shortcut !== false) ? <div>{props.shortcut}</div> : <></>}
        </div>
    )
}

export default MenuTile;
