/// <reference types="react" />
export interface MenuTileType {
    name: string;
    shortcut: string | false;
    onClick: () => void;
    hoverColor?: string;
    backgroundColor?: string;
}
export default function MenuTile(props: MenuTileType | "divider"): JSX.Element;
