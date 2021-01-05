/// <reference types="react" />
import '../css/Components.css';
interface Props {
    locked: boolean;
    disabled?: boolean;
}
export default function Lock({ locked, disabled }: Props): JSX.Element;
export {};
