import * as React from 'react';
import '../css/Components.css';
interface Props {
    children: React.ReactNode;
    onClick: () => void;
    backgroundColor?: string;
    color?: string;
    disabled?: boolean;
}
export default function Button({ children, backgroundColor, color, onClick, disabled }: Props): JSX.Element;
export {};
