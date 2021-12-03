import * as React from 'react';
export interface TitleBarTileType {
    name: string;
    children: React.ReactNode;
}
export declare const TitleBarTile: ({ name, children }: TitleBarTileType) => JSX.Element;
export default TitleBarTile;
