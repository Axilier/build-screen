import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Menu, MenuTile } from '../TitleBar';
import { FixedMouseEvent, Item, SubTool, Vector2 } from '../../Types';
import { AppInfoContext } from '../../Context';

const ContextMenu = (): JSX.Element => {
    const {
        setSelectedSubTool,
        setContextMenuStatus,
        map: { rooms, ...map },
        setMap,
        selectedRoomName,
    } = useContext(AppInfoContext);
    const [clickedPosition, setClickedPosition] = useState<Vector2>({ x: 0, y: 0 });

    useEffect(() => {
        window.addEventListener('contextmenu', handleRightClick);
        return () => {
            window.removeEventListener('contextmenu', handleRightClick);
        };
    });

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    });

    const handleClick = () => {
        setContextMenuStatus('closed');
    };

    const handleRightClick = (event: MouseEvent) => {
        const ev = event as FixedMouseEvent;
        event.preventDefault();
        setClickedPosition({ x: ev.clientX - 3, y: ev.clientY - 8 });
    };

    const bringToFront = () => {
        if (rooms.length === 1) return;
        const selectedRoomIndex = rooms.findIndex(room => room.name === selectedRoomName);
        const tempRoomList = rooms.splice(selectedRoomIndex, 1);
        setMap({
            ...map,
            rooms: [rooms[selectedRoomIndex], ...tempRoomList],
        });
    };

    return (
        <AppInfoContext.Consumer>
            {appInfo => (
                <div
                    style={{
                        position: 'absolute',
                        left: clickedPosition.x,
                        top: clickedPosition.y,
                    }}
                >
                    <Menu
                        open={appInfo.contextMenuStatus === Item.room}
                        color={'#057EFF'}
                        width={200}
                        tileHoveredColor={'#f6f6f6'}
                        backgroundColor={'#e4e4e4'}
                    >
                        <MenuTile
                            name={'Add Door'}
                            onClick={() => {
                                setContextMenuStatus('closed');
                                setSelectedSubTool(SubTool.AddDoor);
                            }}
                        />
                        <MenuTile name={'Arrange'}>
                            <MenuTile name={'Bring to front'} onClick={() => bringToFront()} />
                        </MenuTile>
                    </Menu>
                </div>
            )}
        </AppInfoContext.Consumer>
    );
};

export default ContextMenu;
