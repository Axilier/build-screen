import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import '../../css/PropertiesSidebar.css'
import {Button, Lock, Room, TextBox, Tile, TileList} from 'core'
import {AppInfoContext} from "../../Context";
import {SubTool} from "../../Types";
import TabMenu from "../TabMenu";

interface ShapeInfo {
    width: number | string
    height: number | string
    x: number | string
    y: number | string
}

export default function PropertiesSidebar() {

    const defaultInfo = {
        width: "--",
        height: "--",
        x: "--",
        y: "--"
    }

    const {selectedShapeName, roomList, setRoomList, selectedSubTool} = useContext(AppInfoContext)

    const [shapeInfo, setShapeInfo] = useState<ShapeInfo>(defaultInfo)
    const [selectedTabTop, setSelectedTabTop] = useState(0)
    const [selectedTabBottom, setSelectedTabBottom] = useState(0)

    const menusDisabled = selectedShapeName === null

    useEffect(() => {
        const {width, height, x, y} = roomList.find((value => value.name === selectedShapeName)) || defaultInfo
        setShapeInfo({
            width,
            height,
            x, y
        })
    }, [selectedShapeName])
    useEffect(() => {
        const {width, height, x, y} = roomList.find((value => value.name === selectedShapeName)) || defaultInfo
        setShapeInfo({
            width,
            height,
            x, y
        })
    }, [roomList])
    useEffect(() => {
    }, [shapeInfo])
    useEffect(() => {
        switch (selectedSubTool) {
            case SubTool.AddDoor: {
                setSelectedTabTop(2)
            }
        }
    }, [selectedSubTool])

    const upperMenu = [
        {
            name: "Transform",
            component:
                <>
                    <div className={"transform-component"}>
                        <div>
                            <TextBox label={"X"} units={"Sqr"} disabled={menusDisabled} value={shapeInfo.x.toString()} suffixComponent={<Lock locked={false}/>}/>
                            <TextBox label={"Y"} units={"Sqr"} disabled={menusDisabled} value={shapeInfo.y.toString()} suffixComponent={<Lock locked={false}/>}/>
                        </div>
                        <div>
                            <TextBox label={"Width"} units={"Sqr"} disabled={menusDisabled} value={shapeInfo.width.toString()} suffixComponent={<Lock locked={false}/>}/>
                            <TextBox label={"Height"} units={"Sqr"} disabled={menusDisabled} value={shapeInfo.height.toString()} suffixComponent={<Lock locked={false}/>}/>
                        </div>
                    </div>
                </>
        },
        {
            name: "Colour",
            component: <div>Colour</div>
        },
        {
            name: "Components",
            component:
                <div style={{width: '100%', height: '500px'}}>
                    <TileList>
                        <Tile label={"Door"} locked={false} icon={<Room/>}/>
                        <Tile label={"Door"} locked={false} icon={<Room/>}/>
                        <Tile label={"Door"} locked={false} icon={<Room/>}/>
                        <Tile label={"Door"} locked={false} icon={<Room/>}/>
                    </TileList>
                    <Button label={"Add Component"} variant={"contained"} onClick={() => null} disabled={menusDisabled}/>
                </div>
        }
    ]

    const lowerMenu = [
        {
            name: "Layers",
            component: <div>layers</div>
        },
        {
            name: "Rooms",
            component: <div>rooms</div>
        }
    ]

    return (
        <div
            className={'properties-sidebar'}
            style={{width: 500}}
        >
            <TabMenu selectedTab={selectedTabTop} tabs={upperMenu}/>
            <TabMenu selectedTab={selectedTabBottom} tabs={lowerMenu}/>
        </div>
    )
}
