import * as React from 'react';
import ReactDOM from 'react-dom';
import BuildScreen from 'build-screen';
import { ReactElement, useState } from 'react';
import { RoomType } from '../../src/Types';
import { Button, Menu } from 'core';

const Component = () => {
    const [map, setMap] = useState<Array<RoomType>>([]);
    const [menu, setMenu] = useState(false);
    return (
        <>
            <Button onClick={() => setMenu(true)}>open me</Button>
            <Menu open={menu}>
                <Button onClick={() => setMenu(false)}>close me</Button>
            </Menu>
            <BuildScreen
                map={map}
                fileSaved={true}
                fileSaving={true}
                onMapChange={setMap}
                saveRequested={() => console.log('saveRequest')}
            />
        </>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Component />
    </React.StrictMode>,
    document.getElementById('root'),
);
