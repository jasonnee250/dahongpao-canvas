import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent, InteractiveEventType} from "./InteractiveEvent";

export interface IProcessor{

    allowEventTypeSet:Set<InteractiveEventType>;

    process(event:InteractiveEvent,eventCtx:EventContext):void;

    stop?(event: InteractiveEvent, eventCtx: EventContext):void
}