import * as React from 'react';
import ReactDOM from 'react-dom';
import BuildScreen from 'build-screen';

ReactDOM.render(
    <React.StrictMode>
        <BuildScreen fileSaved={true} fileSaving={true} onMapChange={() => null} saveRequested={() => console.log('saveRequest')} />
    </React.StrictMode>,
    document.getElementById('root'),
);
