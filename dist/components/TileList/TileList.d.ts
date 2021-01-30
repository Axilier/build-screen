/// <reference types="react" />
import '../../css/Components.css';
import { Tile } from "../../Types";
interface Props {
    tiles: Array<Tile>;
}
export default function TileList({ tiles }: Props): JSX.Element;
export {};
