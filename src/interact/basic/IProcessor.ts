import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent, InteractiveEventType} from "./InteractiveEvent.ts";

export interface IProcessor{

    allowEventTypeSet:Set<InteractiveEventType>;

    process(event:InteractiveEvent,eventCtx:EventContext):void;
}