import {EventContext} from "@/plugins";
import {AbsSubMode} from "@/interact/basic/SubMode";
import {InteractiveEvent, InteractiveEventType} from "./InteractiveEvent";
import {GraphicUtils} from "dahongpao-core";
import {IProcessor} from "@/interact";

export abstract class ClickMode extends AbsSubMode {
    private deltaDistance = 2;

    locked:boolean=false;

    constructor(processors:IProcessor[]) {
        super(processors);
    }

    abstract clickEnable(event: InteractiveEvent, ctx: EventContext): boolean;

    canBeEnable(event: InteractiveEvent, ctx: EventContext): boolean {
        if(event.type!==InteractiveEventType.pointerDown){
            return false;
        }
        return this.clickEnable(event, ctx);
    }
    canBeExit(event: InteractiveEvent, ctx: EventContext): boolean {
        return !(ctx.lastInteractiveEvent?.type === InteractiveEventType.pointerDown
            && event.type === InteractiveEventType.pointerup
            && GraphicUtils.distance(ctx.lastInteractiveEvent?.globalPoint, event.globalPoint) < this.deltaDistance / ctx.gmlRender.getScale());

    }

}