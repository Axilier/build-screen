import * as React from 'react';

interface Props {
    type: "basic" | "highlighted"
}

export default function Add({type} : Props) {
    return (
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit={2}
            className={"sidebar-icon"}
        >
            <path fill="none" d="M0 0h16v16H0z"/>
            <clipPath id="prefix__a">
                <path d="M0 0h16v16H0z"/>
            </clipPath>
            <g clipPath="url(#prefix__a)">
                <path
                    d="M16.008 9.068h-6.94v6.94H6.932v-6.94h-6.94V6.932h6.94v-6.94h2.136v6.94h6.94v2.136z"
                    fill={(type === "basic") ? "#303c42" : "#1492e6"}
                    fillRule="nonzero"
                />
            </g>
        </svg>
    )
}
