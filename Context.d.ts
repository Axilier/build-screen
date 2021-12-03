import { Dispatch, SetStateAction } from 'react';
import { Dimension, Item, Map, SubTool, Tool, Vector2 } from './Types';
interface SelectedShapeNameType {
    mousePosition: Vector2;
    backgroundPosition: Vector2;
    backgroundSize: Dimension;
    setBackgroundPosition: Dispatch<SetStateAction<Vector2>> | (() => void);
}
interface AppInfo {
    spacing: number;
    mapInfo: Record<string, string>;
    setMapInfo: Dispatch<SetStateAction<Array<Record<string, string>>>> | (() => void);
    map: Map;
    setMap: Dispatch<SetStateAction<Map>> | (() => void);
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
export declare const AppInfoContext: import("react").Context<AppInfo>;
export declare const BuildStageContext: import("react").Context<SelectedShapeNameType>;
export {};
