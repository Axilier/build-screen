/// <reference types="react" />
import '../../css/Components.css';
interface Props {
    open: boolean;
    onClick?: () => void;
}
export default function Dropdown({ open, onClick }: Props): JSX.Element;
export {};
