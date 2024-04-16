import {Point} from "dahongpao-core";

export interface InteractiveEvent{
    clientPoint:Point;
    globalPoint:Point;
    type:string;
    originEvent:PointerEvent;
}