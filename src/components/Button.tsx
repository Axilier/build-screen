import * as React from 'react';
import {useState} from 'react';
import '../css/Components.css'

interface Props {
    children: React.ReactNode,
    onClick: () => void,
    backgroundColor?: string,
    color?: string,
    disabled?: boolean
}

export default function Button({children, backgroundColor, color, onClick, disabled}: Props) {

    const [clicked, setClicked] = useState(false)

    return (
        <button
            className={"button"}
            style={{
                backgroundColor: (disabled) ? "#8C8C8C" : (backgroundColor || "#3761ff"),
                color: color || "white",
                cursor: (disabled) ? "not-allowed" : "pointer",
                opacity: (disabled) ? 0.6 : 1
            }}
            onClick={onClick}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
        >
            {children}
            <div
                className={"button-filter"}
                style={{
                    opacity: (disabled) ? 0.1 : (clicked) ? 0.1 : 0
                }}
            />
        </button>
    )
}
