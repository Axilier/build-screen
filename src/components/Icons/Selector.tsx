import * as React from 'react';
import {Icon} from "../../Types";

export default function Selector({type}: Icon) {
    return (
        <svg
            viewBox="0 0 16 16"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit={2}
            className={"sidebar-icon"}
        >
            <path d="M2 16l4.5-4H14L2 0v16z" fill="#fff" fillRule="nonzero"/>
            <path
                d="M2 16l4.5-4H14L2 0v16zm9.586-5L3 2.414v11.359l2.836-2.52A.998.998 0 016.5 11h5.086z"
                fill={(type === "basic") ? "#303c42" : "#3761FF"}
            />
        </svg>
    )
}
