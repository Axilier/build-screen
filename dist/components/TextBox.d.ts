/// <reference types="react" />
import '../css/Components.css';
interface Props {
    value: string | number;
    label: string;
    units: string | false;
    onChange?: (value: string) => void;
    maxLength?: number;
    disabled?: boolean;
}
export default function TextBox({ value: initValue, label, units, onChange, maxLength, disabled }: Props): JSX.Element;
export {};
