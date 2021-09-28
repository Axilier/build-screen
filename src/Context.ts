import { createContext, Dispatch, SetStateAction } from 'react';
import { Dimension, Item, RoomType, SubTool, Tool, Vector2 } from './Types';

interface SelectedShapeNameType {
    mousePosition: Vector2;
    backgroundPosition: Vector2;
    backgroundSize: Dimension;
    setBackgroundPosition: Dispatch<SetStateAction<Vector2>> | (() => void);
}

interface AppInfo {
    spacing: number;
    roomList: Array<RoomType>;
    setRoomList: Dispatch<SetStateAction<Array<RoomType>>> | (() => void);
    contextMenuStatus: Item | 'closed';
    setContextMenuStatus: Dispatch<SetStateAction<Item | 'closed'>> | (() => void);
    selectedTool: Tool;
    selectedSubTool: SubTool;
    setSelectedSubTool: Dispatch<SetStateAction<SubTool>> | (() => void);
    cursor: string;
    setCursor: Dispatch<SetStateAction<string>> | (() => void);
    selectedRoomName: string | null;
    setSelectedRoomName: Dispatch<SetStateAction<string | null>> | (() => void);
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
    selectedRoomName: null,
    setSelectedRoomName: () => null,
});
export const BuildStageContext = createContext<SelectedShapeNameType>({
    mousePosition: { x: 0, y: 0 },
    backgroundPosition: { x: 0, y: 0 },
    backgroundSize: { height: 0, width: 0 },
    setBackgroundPosition: () => null,
});
