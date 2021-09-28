import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Lock, Tab, Tabs, TextBox, List, ListItem, Layout } from 'core';
import styles from '../css/PropertiesSidebar.module.css';
import { AppInfoContext } from '../Context';

interface ShapeInfo {
    width: number | string;
    height: number | string;
    x: number | string;
    y: number | string;
}

export const PropertiesSidebar = ({ open }: { open: boolean }) => {
    const { selectedRoomName, roomList, setRoomList, selectedSubTool } = useContext(AppInfoContext);

    const [shapeInfo, setShapeInfo] = useState<ShapeInfo>({
        width: '--',
        height: '--',
        x: '--',
        y: '--',
    });
    const [selectedTabTop, setSelectedTabTop] = useState(0);
    const [selectedTabBottom, setSelectedTabBottom] = useState(0);

    const menusDisabled = selectedRoomName === null;

    useEffect(() => {
        const { width, height, x, y } = roomList.find(value => value.name === selectedRoomName) || {
            width: '--',
            height: '--',
            x: '--',
            y: '--',
        };
        setShapeInfo({
            width,
            height,
            x,
            y,
        });
    }, [roomList, selectedRoomName]);
    // useEffect(() => {
    //     switch (selectedSubTool) {
    //         case SubTool.AddDoor:
    //             setSelectedTabTop(2);
    //             break;
    //         default:
    //             break;
    //     }
    // }, [roomList, selectedSubTool, defaultInfo]);

    const upperMenu = useMemo(() => {
        switch (selectedTabTop) {
            case 0:
                return (
                    <div className={styles.transformComponent}>
                        <div>
                            <TextBox
                                variant={'filled'}
                                size={'small'}
                                label={'X'}
                                units={'Sqr'}
                                disabled={menusDisabled}
                                value={shapeInfo.x.toString()}
                                suffixComponent={<Lock locked={false} />}
                            />
                            <TextBox
                                variant={'filled'}
                                size={'small'}
                                label={'Y'}
                                units={'Sqr'}
                                disabled={menusDisabled}
                                value={shapeInfo.y.toString()}
                                suffixComponent={<Lock locked={false} />}
                            />
                        </div>
                        <div>
                            <TextBox
                                variant={'filled'}
                                size={'small'}
                                label={'Width'}
                                units={'Sqr'}
                                disabled={menusDisabled}
                                value={shapeInfo.width.toString()}
                                suffixComponent={<Lock locked={false} />}
                            />
                            <TextBox
                                variant={'filled'}
                                size={'small'}
                                label={'Height'}
                                units={'Sqr'}
                                disabled={menusDisabled}
                                value={shapeInfo.height.toString()}
                                suffixComponent={<Lock locked={false} />}
                            />
                        </div>
                    </div>
                );
            case 1:
                return <div>Colour</div>;
            default:
                return <div />;
        }
    }, [menusDisabled, selectedTabTop, shapeInfo.height, shapeInfo.width, shapeInfo.x, shapeInfo.y]);
    const lowerMenu = useMemo(() => {
        switch (selectedTabBottom) {
            case 1:
                return <div>rooms</div>;
            case 0:
            default:
                return roomList.length !== 0 ? (
                    <List>
                        {roomList.map(room => (
                            <ListItem key={room.name}>{room.name}</ListItem>
                        ))}
                    </List>
                ) : (
                    <h3 style={{ textAlign: 'center', marginTop: '10px' }}>No objects created yet</h3>
                );
        }
    }, [roomList, selectedTabBottom]);

    return (
        <div className={styles.main} style={{ width: 500, display: open ? 'block' : 'none' }}>
            <Tabs orientation={'row'} onChange={value => setSelectedTabTop(value)} tabFontColor={'black'}>
                <Tab>Transform</Tab>
                <Tab>Colour</Tab>
            </Tabs>
            {upperMenu}
            <Tabs orientation={'row'} onChange={value => setSelectedTabBottom(value)} tabFontColor={'black'}>
                <Tab>Layers</Tab>
                <Tab>Rooms</Tab>
            </Tabs>
            {lowerMenu}
        </div>
    );
};

export default PropertiesSidebar;
