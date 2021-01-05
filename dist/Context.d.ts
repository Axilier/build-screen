import { Dispatch, SetStateAction } from 'react';
import { Item, Room, SubTool, Tool, Vector2 } from "./Types";
interface SelectedShapeNameType {
    mousePosition: Vector2;
}
interface AppInfo {
    roomList: Array<Room>;
    setRoomList: Dispatch<SetStateAction<Array<Room>>> | (() => void);
    contextMenuStatus: Item | 'closed';
    setContextMenuStatus: Dispatch<SetStateAction<Item | 'closed'>> | (() => void);
    selectedTool: Tool;
    selectedSubTool: SubTool;
    setSelectedSubTool: Dispatch<SetStateAction<SubTool>> | (() => void);
    cursor: string;
    setCursor: Dispatch<SetStateAction<string>> | (() => void);
    selectedShapeName: string | null;
    setSelectedShapeName: Dispatch<SetStateAction<string | null>> | (() => void);
}
export declare const AppInfoContext: import("react").Context<AppInfo>;
export declare const BuildStageContext: import("react").Context<SelectedShapeNameType>;
export {};
