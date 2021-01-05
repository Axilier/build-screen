import * as React from 'react';
import {CSSProperties, useEffect, useState} from 'react';
import '../../css/Components.css'

interface Props {
    locked: boolean
    disabled?: boolean
    style?: CSSProperties
}

export default function Lock({locked, disabled, style}: Props) {
    const [isLocked, setIsLocked] = useState(locked)

    useEffect(() => setIsLocked(locked), [locked])

    return (
        <>
            <svg
                style={style}
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
                strokeLinejoin="round"
                strokeMiterlimit={2}
                className={"lock"}
                onClick={() => setIsLocked(!isLocked)}
            >
                <path fill="none" d="M0 0h16v16H0z"/>
                <path
                    d={(isLocked) ?
                        "M4.587 14.066a1.139 1.139 0 01-1.144-1.144V7.585c0-.636.508-1.144 1.144-1.144h.38V4.916c0-1.652 1.399-3.05 3.05-3.05 1.653 0 3.05 1.398 3.05 3.05v1.525h.382c.636 0 1.144.508 1.144 1.144v5.337c0 .636-.508 1.144-1.144 1.144H4.587zm0-1.144h6.862V7.585H4.587v5.337zm5.337-6.481V4.916c0-1.017-.89-1.906-1.906-1.906-1.017 0-1.906.89-1.906 1.906v1.525h3.812z"
                        : "M4.544 14.1A1.15 1.15 0 013.4 12.956V7.62a1.15 1.15 0 011.144-1.144h4.003V5.427A3.543 3.543 0 0112.073 1.9 3.543 3.543 0 0115.6 5.427v1.525a.67.67 0 01-.667.667.67.67 0 01-.667-.667V5.427c0-1.203-.99-2.193-2.193-2.193-1.202 0-2.192.99-2.192 2.193v1.048h1.525a1.15 1.15 0 011.144 1.144v5.337a1.15 1.15 0 01-1.144 1.144H4.544zm0-1.144h6.862V7.62H4.544v5.337z"
                    }
                    fill="#6f7b91"
                    fillRule="nonzero"
                />
                {
                    (disabled) ?
                        <path fill="#ff2f24" d="M12.89 2.404l.706.707L3.111 13.596l-.707-.707z"/> : null
                }
            </svg>
        </>
    )
}
