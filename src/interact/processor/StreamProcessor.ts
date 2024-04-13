import {IProcessor} from "@/interact/processor/IProcessor";
import {EventContext} from "@/plugins/EventContext";

export abstract class StreamProcessor implements IProcessor {

    enable: boolean = false;
    canExit: boolean = true;

    abstract canBeExit(event: PointerEvent, eventCtx: EventContext): boolean ;

    abstract canBeEnable(event: PointerEvent, eventCtx: EventContext): boolean ;

    process(event: PointerEvent, ctx: EventContext): void {
        if (this.enable) {
            this.processEvent(event, ctx);
            return;
        }
        if (event.type === "pointerdown" && this.canBeEnable(event, ctx)) {
            this.enable = true;
            this.processEvent(event, ctx);

        }

    }

    private processEvent(event: PointerEvent, ctx: EventContext) {
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

    abstract onDown(event: PointerEvent, eventCtx: EventContext): void;

    abstract onMove(event: PointerEvent, eventCtx: EventContext): void;

    abstract onUp(event: PointerEvent, eventCtx: EventContext): void;

}