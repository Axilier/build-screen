import * as React from 'react';
import {Icon} from "../../Types";

export default function Mouse({type}: Icon) {
    return (
        <svg
            viewBox="0 0 16 16"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit={2}
            className={"sidebar-icon"}
        >
            <path d="M2 16l4.5-4H14L2 0v16z" fill={(type === "basic") ? "#303c42" : "#3761FF"} fillRule="nonzero"/>
        </svg>
    )
}
