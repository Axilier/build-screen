import * as React from 'react';

export default function PenToolHighlighted() {
    return (
        <svg
            viewBox="0 0 24 24"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={"sidebar-icon"}
        >
            <g stroke="#1492e6">
                <path
                    d="M13.3 5.7c-2.2 1.7-5 2.7-7.8 2.8l-4 14 14-4c.1-2.8 1.1-5.5 2.8-7.8"
                    fill="none"
                />
                <circle cx={10} cy={14} r={1.5} fill="#1492e6" />
                <path d="M1.5 22.5l7.3-7.2" fill="none" />
                <path
                    d="M22.2 7.8l-6-6c-.4-.4-1-.4-1.4 0l-2 2c-.4.4-.4 1 0 1.4l6 6c.4.4 1 .4 1.4 0l2-2c.4-.4.4-1 0-1.4z"
                    fill="#1492e6"
                    fillRule="nonzero"
                />
            </g>
        </svg>
    )
}
