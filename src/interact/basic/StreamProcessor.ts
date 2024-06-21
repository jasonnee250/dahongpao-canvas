import {IProcessor} from "@/interact/basic/IProcessor";
import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent, InteractiveEventType} from "@/interact/basic/InteractiveEvent.ts";

export abstract class StreamProcessor implements IProcessor {

    allowEventTypeSet=new Set([
        InteractiveEventType.pointerDown,
        InteractiveEventType.pointermove,
        InteractiveEventType.pointerup,
    ])
    process(_event: InteractiveEvent, _eventCtx: EventContext) {
        return;
    }

    abstract onStart(event: InteractiveEvent, eventCtx: EventContext): void;

    abstract onMove(event: InteractiveEvent, eventCtx: EventContext): void;

    abstract onUp(event: InteractiveEvent, eventCtx: EventContext): void;

}