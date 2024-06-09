import {Point} from "dahongpao-core";

export enum InteractiveEventType{
    pointerDownOutside="pointerDownOutside",
    pointerDown="pointerdown",
    pointermove="pointermove",
    pointerup="pointerup",
    unknown="unknown",
}
export interface InteractiveEvent{
    clientPoint:Point;
    globalPoint:Point;
    type:InteractiveEventType;
    originEvent:PointerEvent;
}