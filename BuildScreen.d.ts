/// <reference types="react" />
import './css/globals.css';
import { Map } from './Types';
interface Props {
    mapName: string;
    googleApiKey: string;
    map: Map;
    fileSaved: boolean;
    fileSaving: boolean;
    onMapChange: (map: Map) => void;
    saveRequested?: (map: Map) => void;
    onClose: () => void;
}
declare const BuildScreen: ({ mapName, fileSaved, fileSaving, onMapChange, saveRequested, map, googleApiKey, onClose }: Props) => JSX.Element;
export default BuildScreen;
export { RoomType, Vector2, Map } from './Types';
