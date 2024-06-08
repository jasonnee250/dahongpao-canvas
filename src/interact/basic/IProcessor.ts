import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent} from "./InteractiveEvent.ts";

export interface IProcessor{

    process(event:InteractiveEvent,eventCtx:EventContext):void;
}