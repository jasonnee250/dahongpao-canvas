import {EventContext} from "@/plugins/EventContext";

export interface IProcessor{

    canBeExit(event:PointerEvent,eventCtx:EventContext):boolean;

    canBeEnable(event:PointerEvent,eventCtx:EventContext):boolean;

    process(event:PointerEvent,eventCtx:EventContext):void;
}