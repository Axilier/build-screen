import * as React from 'react';
import '../css/Components.css'
import Lock from "./Icons/Lock";
import {useEffect, useState} from "react";

interface Props {
    value: string | number
    label: string
    units: string | false
    onChange?: (value: string) => void
    maxLength?: number
    disabled?: boolean
}

export default function TextBox({value: initValue, label, units, onChange, maxLength, disabled}: Props) {
    const [value,setValue] = useState(initValue)

    useEffect(() => setValue(initValue),[initValue])

    return (
        <div className={"text-box"} style={{color: (disabled) ? "#8C8C8C" : "#000000"}}>
            <div>{label}:</div>
            <div className={"text-box-input-units"} style={{cursor: (disabled) ? "not-allowed" : "default"}}>
                <input
                    value={value}
                    className={"text-box-input"}
                    style={{
                        width: `${maxLength || 3}ch`,
                        cursor: (disabled) ? "not-allowed" : "default"
                    }}
                    onChange={ev => {
                        setValue(ev.target.value)
                        if (!onChange) return;
                        onChange(ev.target.value)
                    }}
                    maxLength={maxLength || 3}
                    disabled={disabled}
                />
                <div style={{display: (!units) ? "none" : "block"}}>Sqr</div>
            </div>
            <Lock locked={true} disabled={disabled}/>
        </div>
    )
}
