import * as React from 'react';
import {useState} from 'react';
import {Dropdown, RoomIcon} from "../Icons";
import '../../css/Components.css'
import {Tile} from "../../Types";
import Lock from "../Icons/Lock";
import TickBox from "../Icons/TickBox";

interface Props {
    tiles: Array<Tile>
}

export default function TileList({tiles}: Props) {

    const [componentListOpen, setComponentListOpen] = useState(false)

    return (
        <div style={{border: "solid 1px #D3D3D3"}}>
            {
                tiles.map(({name, components, locked, shown}) => (
                    <div className={"tile-list-tile"}>
                        <div className={"tile-list-tile-segment"}>
                            {
                                (components) ?
                                    <Dropdown open={componentListOpen} onClick={() => setComponentListOpen(!componentListOpen)}/>
                                    : <div className={"drop-down-icon"}/>
                            }
                            <RoomIcon/>
                            {name}
                        </div>
                        <div className={"tile-list-tile-segment"}>
                            <Lock locked={locked} style={{marginRight: "13px"}}/>
                            <TickBox ticked={shown}/>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
