import * as React from 'react';
import { createContext } from 'react';
import styles from '../../css/TitleBar.module.css';
import { BasicProps } from '../../Types';

interface TitleBarProps {
    children: React.ReactNode;
}

export const TitleBarContext = createContext({
    backgroundColor: '',
    color: '',
    hoveredColor: '',
    menuTileTextColor: '',
    menuTileHoverColor: '',
});

const TitleBar = ({
    children,
    backgroundColor,
    color,
    hoveredColor,
    menuTileTextColor,
    menuTileHoverColor,
}: TitleBarProps & BasicProps): JSX.Element => {
    return (
        <TitleBarContext.Provider
            value={{
                backgroundColor,
                color,
                hoveredColor,
                menuTileHoverColor: menuTileHoverColor || '',
                menuTileTextColor: menuTileTextColor || '',
            }}
        >
            <div className={styles.titlebar}>{children}</div>
        </TitleBarContext.Provider>
    );
};

export default TitleBar;
