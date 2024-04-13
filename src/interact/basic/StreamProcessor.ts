import {IProcessor} from "@/interact/basic/IProcessor";
import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent.ts";

export abstract class StreamProcessor implements IProcessor {

    enable: boolean = false;
    canExit: boolean = true;

    canBeExit(_event: InteractiveEvent, _eventCtx: EventContext): boolean {
        return this.canExit;
    }

    canBeEnable(event: InteractiveEvent, eventCtx: EventContext): boolean {
        return event.type === "pointerdown" && this._onCanBeEnable(event, eventCtx);

    }

    abstract _onCanBeEnable(event: InteractiveEvent, eventCtx: EventContext):boolean;

    process(event: InteractiveEvent, ctx: EventContext): void {
        if (this.enable) {
            this._processEvent(event, ctx);
            return;
        }
        if (event.type === "pointerdown" && this.canBeEnable(event, ctx)) {
            this.enable = true;
            this._processEvent(event, ctx);

        }

    }

    private _processEvent(event: InteractiveEvent, ctx: EventContext) {
        if (event.type === "pointerdown") {
            this.onDown(event, ctx);
            this.canExit = false;
        } else if (event.type === "pointermove") {
            this.onMove(event, ctx);
        } else if (event.type === "pointerup") {
            this.onUp(event, ctx);
            this.enable = false;
            this.canExit = true;
        } else {
            this.canExit = true;
            this.enable = false;
        }
    }

    abstract onDown(event: InteractiveEvent, eventCtx: EventContext): void;

    abstract onMove(event: InteractiveEvent, eventCtx: EventContext): void;

    abstract onUp(event: InteractiveEvent, eventCtx: EventContext): void;

}