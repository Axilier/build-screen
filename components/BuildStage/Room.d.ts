/// <reference types="react" />
import { RoomType } from '../../Types';
declare const Room: ({ x: initX, y: initY, height: initHeight, width: initWidth, index, name, doorPosition: initDoorPosition, }: RoomType & {
    index: number;
}) => JSX.Element;
export default Room;
