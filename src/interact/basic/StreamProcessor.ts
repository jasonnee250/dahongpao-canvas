import {IProcessor} from "@/interact/basic/IProcessor";
import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent.ts";

export abstract class StreamProcessor implements IProcessor {

    process(_event: InteractiveEvent, _eventCtx: EventContext) {
        return;
    }

    abstract onStart(event: InteractiveEvent, eventCtx: EventContext): void;

    abstract onMove(event: InteractiveEvent, eventCtx: EventContext): void;

    abstract onUp(event: InteractiveEvent, eventCtx: EventContext): void;

}