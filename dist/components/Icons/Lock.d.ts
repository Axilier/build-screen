import { CSSProperties } from 'react';
import '../../css/Components.css';
interface Props {
    locked: boolean;
    disabled?: boolean;
    style?: CSSProperties;
}
export default function Lock({ locked, disabled, style }: Props): JSX.Element;
export {};
