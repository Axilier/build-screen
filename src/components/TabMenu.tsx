import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import '../css/Components.css'

interface Props {
    selectedTab: number,
    tabs: Array<{
        name: string,
        component: JSX.Element
    }>
}

export default function TabMenu({tabs, selectedTab: propSelectedTab}: Props) {

    const [selectedTab, setSelectedTab] = useState(0)
    const [indicatorWidth, setIndicatorWidth] = useState(0)
    const menu = useRef<HTMLDivElement>(null)

    useEffect(() => setIndicatorWidth(menu.current?.children.namedItem(tabs[selectedTab].name)?.clientWidth || 0), [menu.current?.children])
    useEffect(() => {
        setSelectedTab(propSelectedTab)
    }, [propSelectedTab])

    return (
        <>
            <div className={"tab-menu"} ref={menu}>
                {
                    tabs.map(({name}, index) =>
                        <div
                            key={name}
                            id={name}
                            className={`tab ${index === selectedTab ? "tab-selected" : "tab-not-selected"}`}
                            onClick={() => setSelectedTab(index)}
                        >
                            {name}
                            <div className={"tab-selected-shadow"} style={{width: indicatorWidth - 4, left: 2}}/>
                        </div>
                    )
                }
                <div className={"tab-selected-block"}
                     style={{
                         left: (menu.current?.children[0]?.clientWidth || 0) * selectedTab,
                         width: indicatorWidth
                     }}
                />
            </div>
            <div className={"tab-menu-component-container"}>
                {
                    tabs[selectedTab].component
                }
            </div>
        </>
    )
}
