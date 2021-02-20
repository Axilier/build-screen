/** @format */

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import '../css/PropertiesSidebar.css';
import {
    Button,
    Lock,
    Room,
    Tab,
    TabMenu,
    TextBox,
    Tile,
    TileList,
} from 'core';
import { AppInfoContext } from '../Context';
import { SubTool } from '../Types';

interface ShapeInfo {
    width: number | string;
    height: number | string;
    x: number | string;
    y: number | string;
}

export const PropertiesSidebar = () => {
    const defaultInfo = {
        width: '--',
        height: '--',
        x: '--',
        y: '--',
    };

    const {
        selectedShapeName,
        roomList,
        setRoomList,
        selectedSubTool,
    } = useContext(AppInfoContext);

    const [shapeInfo, setShapeInfo] = useState<ShapeInfo>(defaultInfo);
    const [selectedTabTop, setSelectedTabTop] = useState(0);
    const [selectedTabBottom, setSelectedTabBottom] = useState(0);

    const menusDisabled = selectedShapeName === null;

    useEffect(() => {
        const { width, height, x, y } =
            roomList.find(value => value.name === selectedShapeName) ||
            defaultInfo;
        setShapeInfo({
            width,
            height,
            x,
            y,
        });
    }, [selectedShapeName]);
    useEffect(() => {
        const { width, height, x, y } =
            roomList.find(value => value.name === selectedShapeName) ||
            defaultInfo;
        setShapeInfo({
            width,
            height,
            x,
            y,
        });
    }, [roomList]);
    useEffect(() => {
        switch (selectedSubTool) {
            case SubTool.AddDoor: {
                setSelectedTabTop(2);
            }
        }
    }, [selectedSubTool]);

    const upperMenu = (tab: number) => {
        switch (tab) {
            case 0:
                return (
                    <div className={'transform-component'}>
                        <div>
                            <TextBox
                                label={'X'}
                                units={'Sqr'}
                                disabled={menusDisabled}
                                value={shapeInfo.x.toString()}
                                suffixComponent={<Lock locked={false} />}
                            />
                            <TextBox
                                label={'Y'}
                                units={'Sqr'}
                                disabled={menusDisabled}
                                value={shapeInfo.y.toString()}
                                suffixComponent={<Lock locked={false} />}
                            />
                        </div>
                        <div>
                            <TextBox
                                label={'Width'}
                                units={'Sqr'}
                                disabled={menusDisabled}
                                value={shapeInfo.width.toString()}
                                suffixComponent={<Lock locked={false} />}
                            />
                            <TextBox
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
            case 2:
                return (
                    <>
                        <TileList>
                            <Tile
                                label={'Door'}
                                locked={false}
                                icon={<Room />}
                            />
                            <Tile
                                label={'Door'}
                                locked={false}
                                icon={<Room />}
                            />
                            <Tile
                                label={'Door'}
                                locked={false}
                                icon={<Room />}
                            />
                            <Tile
                                label={'Door'}
                                locked={false}
                                icon={<Room />}
                            />
                        </TileList>
                        <Button
                            label={'Add Component'}
                            variant={'contained'}
                            size={'230px'}
                            className={'build-prop-add-comp'}
                            onClick={() => null}
                            disabled={menusDisabled}
                        />
                    </>
                );
            default:
                return <div />;
        }
    };

    return (
        <div className={'properties-sidebar'} style={{ width: 500 }}>
            <TabMenu
                onChange={value => setSelectedTabTop(value)}
                tabFontColor={'black'}
            >
                <Tab>Transform</Tab>
                <Tab>Colour</Tab>
                <Tab>Components</Tab>
            </TabMenu>
            {upperMenu(selectedTabTop)}
            <TabMenu
                onChange={value => setSelectedTabBottom(value)}
                tabFontColor={'black'}
            >
                <Tab>Layers</Tab>
                <Tab>Rooms</Tab>
            </TabMenu>
        </div>
    );
};

export default PropertiesSidebar;
