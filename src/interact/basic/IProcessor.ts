import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent} from "./InteractiveEvent.ts";

export interface IProcessor{

    canBeExit(event:InteractiveEvent,eventCtx:EventContext):boolean;

    canBeEnable(event:InteractiveEvent,eventCtx:EventContext):boolean;

    process(event:InteractiveEvent,eventCtx:EventContext):void;
}