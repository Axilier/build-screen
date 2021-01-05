import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import '../../css/DropMenu.css'
import Menu from "../TitleBar/Menu";
import {MenuTileType} from "../TitleBar/MenuTile";
import {FixedMouseEvent, SubTool, Vector2} from "../../Types";
import {AppInfoContext} from "../../Context";

export default function ContextMenu() {

    const {setSelectedSubTool} = useContext(AppInfoContext)

    const roomTiles: Array<MenuTileType> = [
        {
            name: "Add Door",
            shortcut: false,
            onClick: () => setSelectedSubTool(SubTool.AddDoor)
        }
    ]
    const [clickedPosition, setClickedPosition] = useState<Vector2>({x: 0, y: 0})

    useEffect(() => {
        window.addEventListener("contextmenu", handleRightClick)
        return function cleanup() {
            window.removeEventListener("contextmenu", handleRightClick)
        }
    })

    function handleRightClick(event: MouseEvent) {
        const ev = event as FixedMouseEvent
        event.preventDefault()
        setClickedPosition({x: ev.clientX - 3, y: ev.clientY - 8})
    }

    return (
        <AppInfoContext.Consumer>
            {
                appInfo => (
                    <div
                        style={{position: 'absolute', left: clickedPosition.x, top: clickedPosition.y}}
                        onMouseLeave={() => appInfo.setContextMenuStatus("closed")}
                    >
                        <Menu open={appInfo.contextMenuStatus !== "closed"} menuTiles={roomTiles} color={"#057EFF"}
                              width={200} tileHoverColor={"#f6f6f6"}
                              backgroundColor={"#e4e4e4"}/>
                    </div>
                )

            }
        </AppInfoContext.Consumer>
    )
}

