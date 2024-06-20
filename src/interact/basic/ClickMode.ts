import {EventContext} from "@/plugins";
import {AbsSubMode} from "@/interact/basic/SubMode";
import {InteractiveEvent, InteractiveEventType} from "./InteractiveEvent";
import {GraphicUtils} from "dahongpao-core";
import {IProcessor} from "@/interact";

export abstract class ClickMode extends AbsSubMode {
    private deltaDistance = 1;
    locked: boolean = false;

    constructor(processors:IProcessor[]) {
        super(processors);
    }

    abstract clickEnable(event: InteractiveEvent, ctx: EventContext): boolean;

    canBeEnable(event: InteractiveEvent, ctx: EventContext): boolean {
        if(event.type!==InteractiveEventType.pointerDown){
            return false;
        }
        const res=this.clickEnable(event, ctx);
        if(res){
            this.locked=true;
        }
        return res;
    }

    work(event: InteractiveEvent, ctx: EventContext) {
        //pointer up能够退出
        if(event.type===InteractiveEventType.pointerup){
            this.locked=false;
        }
        //非pointerup事件如果距离小于阈值，不能退出
        const distance=GraphicUtils.distance(ctx.lastDiffTypeEvent?.globalPoint, event.globalPoint);
        if(distance>this.deltaDistance/ ctx.gmlRender.getScale()){
            this.locked=false;
        }
        super.work(event, ctx);
    }

    canBeExit(event: InteractiveEvent, ctx: EventContext): boolean {
        return !this.locked;
    }

}