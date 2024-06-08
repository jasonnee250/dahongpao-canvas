import {EventContext} from "@/plugins";
import {AbsSubMode} from "src/interact/basic/SubMode";
import {InteractiveEvent, InteractiveEventType} from "./InteractiveEvent";
import {GraphicUtils} from "dahongpao-core";

export abstract class ClickMode extends AbsSubMode {
    private deltaDistance = 2;

    locked:boolean=false;

    abstract clickEnable(event: InteractiveEvent, ctx: EventContext): boolean;

    canBeEnable(event: InteractiveEvent, ctx: EventContext): boolean {
        return this.clickEnable(event, ctx);
    }
    canBeExit(event: InteractiveEvent, ctx: EventContext): boolean {
        return !(ctx.lastInteractiveEvent?.type === InteractiveEventType.pointerDown
            && event.type === InteractiveEventType.pointerup
            && GraphicUtils.distance(ctx.lastInteractiveEvent?.globalPoint, event.globalPoint) < this.deltaDistance / ctx.gmlRender.getScale());

    }

}