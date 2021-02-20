/** @format */

import { createContext, Dispatch, SetStateAction } from 'react';
import { Item, RoomType, SubTool, Tool, Vector2 } from './Types';

interface SelectedShapeNameType {
    mousePosition: Vector2;
}

interface AppInfo {
    spacing: number;
    roomList: Array<RoomType>;
    setRoomList: Dispatch<SetStateAction<Array<RoomType>>> | (() => void);
    contextMenuStatus: Item | 'closed';
    setContextMenuStatus:
        | Dispatch<SetStateAction<Item | 'closed'>>
        | (() => void);
    selectedTool: Tool;
    selectedSubTool: SubTool;
    setSelectedSubTool: Dispatch<SetStateAction<SubTool>> | (() => void);
    cursor: string;
    setCursor: Dispatch<SetStateAction<string>> | (() => void);
    selectedShapeName: string | null;
    setSelectedShapeName:
        | Dispatch<SetStateAction<string | null>>
        | (() => void);
}

export const AppInfoContext = createContext<AppInfo>({
    spacing: 10,
    roomList: [],
    setRoomList: () => null,
    contextMenuStatus: 'closed',
    setContextMenuStatus: () => null,
    selectedTool: Tool.Cursor,
    selectedSubTool: SubTool.null,
    setSelectedSubTool: () => null,
    cursor: 'default',
    setCursor: () => null,
    selectedShapeName: null,
    setSelectedShapeName: () => null,
});
export const BuildStageContext = createContext<SelectedShapeNameType>({
    mousePosition: { x: 0, y: 0 },
});
