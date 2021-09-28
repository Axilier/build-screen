import * as React from 'react';
import {Icon} from "../../Types";

const AddRoom = ({type}: Icon) => {
    return (
        <svg
            viewBox="0 0 17 16"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit={2}
            className={"sidebar-icon"}
        >
            <path
                d="M11.66 3.645a.359.359 0 00-.136.026l-.061.03L6.87 6.085l-.104.053-.002.002a.678.678 0 00-.335.574v4.978c0 .17.15.31.34.31a.369.369 0 00.162-.039l.014-.007 4.68-2.483.007-.004A.68.68 0 0012 8.876V3.953c0-.17-.153-.308-.34-.308z"
                fill={type==="basic"?"#303c42":"#3761FF"}
                fillRule="nonzero"
            />
            <path
                d="M10.369 9.679a.282.282 0 01-.153.245l-.003.002-1.939 1.028-.006.004a.153.153 0 01-.067.015c-.078 0-.14-.057-.14-.128V7.363a.28.28 0 01.139-.239l.043-.022 1.903-.987.025-.013a.149.149 0 01.057-.01c.077 0 .14.057.14.127v3.46z"
                fill="#a4abba"
                fillRule="nonzero"
            />
            <path
                d="M11.31 2.318L6.445.128S6.158 0 6 0c-.159 0-.443.128-.443.128l-4.87 2.19s-.215.088-.215.253c0 .176.222.308.222.308l4.891 2.582.078.04a.83.83 0 00.678-.002l.068-.035 4.9-2.586s.2-.108.2-.307c0-.174-.198-.253-.198-.253zM5.236 6.139l-.107-.055L.537 3.702.476 3.67a.352.352 0 00-.136-.026c-.188 0-.34.138-.34.308v4.923a.68.68 0 00.368.592l.005.004 4.68 2.483a.362.362 0 00.179.045c.187 0 .34-.138.34-.31V6.714a.678.678 0 00-.336-.574z"
                fill={type==="basic"?"#303c42":"#3761FF"}
                fillRule="nonzero"
            />
            <g>
                <path fill="#a4abba" d="M12.667 11h1.666v5h-1.666z"/>
            </g>
            <g>
                <path fill="#a4abba" d="M16 12.667v1.666h-5v-1.666z"/>
            </g>
        </svg>
    )
}

export default AddRoom;
