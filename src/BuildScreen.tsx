import * as React from 'react';
import { useEffect, useState } from 'react';
import { Cursor, CursorFill, House } from 'react-bootstrap-icons';
import { Layout } from 'core';
import styles from './css/BuildScreen.module.css';
import './css/globals.css';
import TileLogo from './assets/TileLogo';
import BuildStage from './components/BuildStage/BuildStage';
import { Item, RoomType, SubTool, Tool } from './Types';
import { AppInfoContext } from './Context';
import ContextMenu from './components/ContextMenu/ContextMenu';
import PropertiesSidebar from './components/PropertiesSidebar';
import { MenuTile, TitleBar } from './components/TitleBar';
import TitleBarTile from './components/TitleBar/TitleBarTile';
import useEventListener from './components/useEventListener';

interface Props {
    fileSaved: boolean;
    fileSaving: boolean;
    onMapChange: (map: Array<RoomType>) => void;
    saveRequested?: (map: Array<RoomType>) => void;
}

const BuildScreen = ({ fileSaved, fileSaving, onMapChange, saveRequested }: Props): JSX.Element => {
    const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Cursor);
    const [selectedSubTool, setSelectedSubTool] = useState<SubTool>(SubTool.null);
    const [cursor, setCursor] = useState<string>('default');
    const [contextMenuStatus, setContextMenuStatus] = useState<Item | 'closed'>('closed');
    const [selectedShapeName, setSelectedShapeName] = useState<string | null>(null);
    const [roomList, setRoomList] = useState<Array<RoomType>>([]);

    const [propertiesWindowStatus, setPropertiesWindowStatus] = useState(false);

    useEffect(() => {
        const keydown = (event: KeyboardEvent) => {
            if (event.key === '`') {
                setPropertiesWindowStatus(!propertiesWindowStatus);
            }
        };
        document.addEventListener('keydown', keydown);
        return () => document.removeEventListener('keydown', keydown);
    });
    useEffect(() => onMapChange(roomList), [onMapChange, roomList]);

    useEventListener('keydown', e => {
        if (e.key !== 's' || !e.ctrlKey || !saveRequested) return;
        e.preventDefault();
        saveRequested(roomList);
    });

    return (
        <AppInfoContext.Provider
            value={{
                spacing: 10,
                roomList,
                setRoomList,
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
                        <div className={styles.filename}>{'test'}</div>
                        <TitleBar backgroundColor={'#FFFFFF'} color={'black'} hoveredColor={'#F3F3F3'} menuTileTextColor={'black'}>
                            <TitleBarTile name={'File'}>
                                <MenuTile name={'New'} shortcut={'Ctrl+N'} onClick={() => console.log('New')} />
                                <MenuTile name={'Open'} shortcut={'Ctrl+O'} onClick={() => console.log('Open')} />
                                <MenuTile
                                    name={'Save'}
                                    shortcut={'Ctrl+S'}
                                    onClick={() => {
                                        if (saveRequested) saveRequested(roomList);
                                    }}
                                />
                            </TitleBarTile>
                            <TitleBarTile name={'Edit'}>
                                <MenuTile name={'Undo'} shortcut={'Ctrl+Z'} onClick={() => console.log('Undo')} />
                                <MenuTile name={'Redo'} shortcut={'Ctrl+Shift+Z'} onClick={() => console.log('Redo')} />
                            </TitleBarTile>
                            <h5 className={styles.savingAlert}>{fileSaved ? (fileSaving ? 'File Saving...' : 'File Saved.') : 'Unsaved Changes'}</h5>
                        </TitleBar>
                    </Layout>
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
                    </div>
                    <BuildStage propertiesWindow={propertiesWindowStatus} />
                    <PropertiesSidebar open={propertiesWindowStatus} />
                </Layout>
            </Layout>
            <ContextMenu />
        </AppInfoContext.Provider>
    );
};

export default BuildScreen;
