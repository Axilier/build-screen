import * as React from 'react';
import ReactDOM from 'react-dom';
import BuildScreen from 'build-screen';
import { useState } from 'react';
import { Map } from '../../src/Types';

export const Component = () => {
    const [map, setMap] = useState<Map>({
        rooms: [],
        position: { lat: 1, lng: 1 },
        ratios: { lat: 1, lng: 1 },
        rotation: 0,
        scale: { x: 1, y: 1 },
    });
    const [menu, setMenu] = useState(false);
    return (
        <>
            <BuildScreen
                googleApiKey={process.env.REACT_APP_GOOGLE_API_KEY || 't'}
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
