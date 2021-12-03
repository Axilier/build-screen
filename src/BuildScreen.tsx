import * as React from 'react';
import { useEffect, useState } from 'react';
import { Cursor, CursorFill, House, PinMap, BoxArrowLeft } from 'react-bootstrap-icons';
import { Layout } from 'core';
import styles from './css/BuildScreen.module.css';
import './css/globals.css';
import TileLogo from './assets/TileLogo';
import BuildStage from './components/BuildStage/BuildStage';
import { Item, SubTool, Tool, Map } from './Types';
import { AppInfoContext } from './Context';
import ContextMenu from './components/ContextMenu/ContextMenu';
import PropertiesSidebar from './components/PropertiesSidebar';
import { MenuTile, TitleBar } from './components/TitleBar';
import TitleBarTile from './components/TitleBar/TitleBarTile';
import useEventListener from './components/useEventListener';

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

const BuildScreen = ({ mapName, fileSaved, fileSaving, onMapChange, saveRequested, map, googleApiKey, onClose }: Props): JSX.Element => {
    const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Cursor);
    const [selectedSubTool, setSelectedSubTool] = useState<SubTool>(SubTool.null);
    const [cursor, setCursor] = useState<string>('default');
    const [contextMenuStatus, setContextMenuStatus] = useState<Item | 'closed'>('closed');
    const [selectedShapeName, setSelectedShapeName] = useState<string | null>(null);
    const [stateMap, setMap] = useState<Map>(map);
    const [mapInfo, setMapInfo] = useState({});

    const [propertiesWindowStatus, setPropertiesWindowStatus] = useState(false);

    // useEffect(() => {
    //     const keydown = (event: KeyboardEvent) => {
    //         if (event.key === '`') {
    //             setPropertiesWindowStatus(!propertiesWindowStatus);
    //         }
    //     };
    //     document.addEventListener('keydown', keydown);
    //     return () => document.removeEventListener('keydown', keydown);
    // });
    useEffect(() => onMapChange(stateMap), [onMapChange, stateMap]);

    useEventListener('keydown', e => {
        if (e.key !== 's' || !e.ctrlKey || !saveRequested) return;
        e.preventDefault();
        saveRequested(stateMap);
    });

    return (
        <AppInfoContext.Provider
            value={{
                spacing: 10,
                mapInfo,
                setMapInfo,
                map: stateMap,
                setMap,
                selectedTool,
                cursor,
                setCursor,
                contextMenuStatus,
                setContextMenuStatus,
                selectedSubTool,
                setSelectedSubTool,
                selectedRoomName: selectedShapeName,
                setSelectedRoomName: setSelectedShapeName,
            }}
        >
            <Layout orientation={'column'} className={styles.buildScreen}>
                <div className={styles.toolbar}>
                    <div className={styles.logoContainer}>
                        <TileLogo />
                    </div>
                    <Layout orientation={'column'}>
                        <div className={styles.filename}>{mapName}</div>
                        <TitleBar backgroundColor={'#FFFFFF'} color={'black'} hoveredColor={'#F3F3F3'} menuTileTextColor={'black'}>
                            <TitleBarTile name={'File'}>
                                <MenuTile
                                    name={'Save'}
                                    shortcut={'Ctrl+S'}
                                    onClick={() => {
                                        if (saveRequested) saveRequested(stateMap);
                                    }}
                                />
                            </TitleBarTile>
                            <h5 className={styles.savingAlert}>{fileSaved ? (fileSaving ? 'File Saving...' : 'File Saved.') : 'Unsaved Changes'}</h5>
                        </TitleBar>
                    </Layout>
                    <BoxArrowLeft onClick={() => onClose()} className={styles.exit} />
                    <div className={styles.toolbarLine} />
                </div>
                <Layout orientation={'row'}>
                    <div className={styles.sideToolbar}>
                        <div
                            role={'tab'}
                            className={styles.sideToolbarIconContainer}
                            onClick={() => {
                                setSelectedTool(selectedTool === Tool.Cursor ? Tool.null : Tool.Cursor);
                                setCursor('default');
                            }}
                        >
                            <CursorFill
                                color={selectedTool === Tool.Cursor ? '#3761FF' : '#303c42'}
                                className={styles.sidebarIcon}
                                height={22}
                                width={22}
                            />
                        </div>
                        <div
                            role={'tab'}
                            className={styles.sideToolbarIconContainer}
                            onClick={() => {
                                setSelectedTool(selectedTool === Tool.Selector ? Tool.null : Tool.Selector);
                                setCursor('default');
                            }}
                        >
                            <Cursor
                                color={selectedTool === Tool.Selector ? '#3761FF' : '#303c42'}
                                className={styles.sidebarIcon}
                                height={22}
                                width={22}
                            />
                        </div>
                        <div
                            role={'tab'}
                            className={styles.sideToolbarIconContainer}
                            onClick={() => {
                                setSelectedTool(selectedTool === Tool.Add ? Tool.null : Tool.Add);
                                setCursor('crosshair');
                            }}
                        >
                            <House color={selectedTool === Tool.Add ? '#3761FF' : '#303c42'} className={styles.sidebarIcon} height={22} width={22} />
                        </div>
                        <div
                            role={'tab'}
                            className={styles.sideToolbarIconContainer}
                            onClick={() => {
                                setSelectedTool(selectedTool === Tool.Position ? Tool.null : Tool.Position);
                                setCursor('grab');
                            }}
                        >
                            <PinMap
                                color={selectedTool === Tool.Position ? '#3761FF' : '#303c42'}
                                className={styles.sidebarIcon}
                                height={22}
                                width={22}
                            />
                        </div>
                    </div>
                    <BuildStage googleApiKey={googleApiKey} propertiesWindow={propertiesWindowStatus} />
                    <PropertiesSidebar open={propertiesWindowStatus} />
                </Layout>
            </Layout>
            {/* <ContextMenu /> */}
        </AppInfoContext.Provider>
    );
};

export default BuildScreen;
export { RoomType, Vector2, Map } from './Types';
