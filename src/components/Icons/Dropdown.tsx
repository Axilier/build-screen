import * as React from 'react';
import {useEffect, useState} from 'react';
import '../../css/Components.css'

interface Props {
    open: boolean
    onClick?: () => void
}

export default function Dropdown({open, onClick}: Props) {

    const [isOpen, setIsOpen] = useState(open)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    return (
        <svg
            transform={(isOpen) ? "rotate(90)" : "none"}
            className={"drop-down-icon"}
            onClick={() => {
                if (!onClick) return;
                onClick()
            }}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit={2}
        >
            <g transform="matrix(2.90892 0 0 2.9091 -4174.32 -1000.725)">
                <circle cx={1446} cy={355} r={11} fill="#ebebeb"/>
                <path
                    d="M1446 344c6.07 0 11 4.929 11 11s-4.93 11-11 11-11-4.929-11-11 4.93-11 11-11zm0 .174c5.98 0 10.83 4.851 10.83 10.826 0 5.975-4.85 10.826-10.83 10.826-5.97 0-10.83-4.851-10.83-10.826 0-5.975 4.86-10.826 10.83-10.826z"
                    fill="#d3d3d3"
                />
            </g>
            <path
                d="M47.297 31.109L23.8 47.997V14.22l23.497 16.889z"
                fill="#d3d3d3"
            />
        </svg>
    )
}
