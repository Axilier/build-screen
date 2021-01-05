import * as React from 'react';
import {useState} from 'react';
import './css/BuildScreen.css';
import TileLogo from './assets/TileLogo';
import TitleBar from "./components/TitleBar/TitleBar";
import {TitleBarTileType} from "./components/TitleBar/TitleBarTile";
import BuildStage from "./components/BuildStage/BuildStage";
import {Mouse, Selector} from './components/Icons'
import {Item, Room, SubTool, Tool} from './Types'
import {AppInfoContext} from "./Context";
import ContextMenu from "./components/ContextMenu/ContextMenu";
import PropertiesSidebar from "./components/PropertiesSidebar/PropertiesSidebar";

export default function BuildScreen() {
    const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Cursor)
    const [selectedSubTool, setSelectedSubTool] = useState<SubTool>(SubTool.null)
    const [cursor, setCursor] = useState<string>("default")
    const [contextMenuStatus, setContextMenuStatus] = useState<Item | "closed">("closed")
    const [selectedShapeName, setSelectedShapeName] = useState<string | null>(null)
    const [roomList, setRoomList] = useState<Array<Room>>([{name: "room-01", x: 10, y: 10, height: 10, width: 10}])

    const titleBarLayout: Array<TitleBarTileType> = [
        {
            name: "File",
            menuLayout: [
                {
                    name: "New",
                    shortcut: "Ctrl+N",
                    onClick: () => console.log("New")
                },
                {
                    name: "Open",
                    shortcut: "Ctrl+O",
                    onClick: () => console.log("Open")
                }
            ]
        },
        {
            name: "Edit",
            menuLayout: [
                {
                    name: "Undo",
                    shortcut: "Ctrl+Z",
                    onClick: () => console.log("Undo")
                },
                {
                    name: "Redo",
                    shortcut: "Ctrl+Shift+Z",
                    onClick: () => console.log("Redo")
                }
            ]
        }
    ]

    return (
        <AppInfoContext.Provider
            value={{
                roomList,
                setRoomList,
                selectedTool,
                cursor: cursor,
                setCursor,
                contextMenuStatus,
                setContextMenuStatus,
                selectedSubTool,
                setSelectedSubTool,
                selectedShapeName,
                setSelectedShapeName
            }}>
            <div className={'build-screen'}>
                <div className={'toolbar'}>
                    <div className={"logo-container"}>
                        <TileLogo/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div className={"filename"}>test</div>
                        <TitleBar backgroundColor={"#FFFFFF"} color={"black"} hoveredColor={"#F3F3F3"}
                                  TileList={titleBarLayout} menuTileTextColor={"black"}/>
                    </div>
                    <div className={"toolbar-line"}/>
                </div>
                <div className={'main-body'}>
                    <div className={'side-toolbar'}>
                        <div className={'side-toolbar-icon-container'}
                             onClick={() => setSelectedTool((selectedTool === Tool.Cursor) ? Tool.null : Tool.Cursor)}>
                            {selectedTool === Tool.Cursor ? <Mouse type={"highlighted"}/> : <Mouse type={"basic"}/>}
                        </div>
                        <div className={'side-toolbar-icon-container'}
                             onClick={() => setSelectedTool((selectedTool === Tool.Selector) ? Tool.null : Tool.Selector)}>
                            {selectedTool === Tool.Selector ? <Selector type={"highlighted"}/> :
                                <Selector type={"basic"}/>}
                        </div>
                    </div>
                    <BuildStage/>
                    <PropertiesSidebar/>
                </div>
            </div>
            <ContextMenu/>
        </AppInfoContext.Provider>
    );
}


