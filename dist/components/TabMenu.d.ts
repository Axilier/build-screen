/// <reference types="react" />
import '../css/Components.css';
interface Props {
    selectedTab: number;
    tabs: Array<{
        name: string;
        component: JSX.Element;
    }>;
}
export default function TabMenu({ tabs, selectedTab: propSelectedTab }: Props): JSX.Element;
export {};
