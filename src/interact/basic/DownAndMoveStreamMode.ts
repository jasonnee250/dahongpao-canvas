import {AbsSubMode} from "@/interact/basic/SubMode";
import {InteractiveEvent, InteractiveEventType} from "@/interact/basic/InteractiveEvent";
import {EventContext} from "@/plugins";
import {StreamProcessor} from "@/interact/basic/StreamProcessor";
import {IProcessor} from "@/interact/basic/IProcessor";
import {GraphicUtils} from "dahongpao-core";

export abstract class DownAndMoveStreamMode extends AbsSubMode {

    streamProcessor:StreamProcessor[];
    private deltaDistance = 1;

    locked: boolean = false;

    constructor(streamProcessor:StreamProcessor[],processors:IProcessor[]=[]) {
        super(processors);
        this.streamProcessor=streamProcessor;
    }

    abstract streamEnable(event: InteractiveEvent, ctx: EventContext): boolean;

    canBeEnable(event: InteractiveEvent, ctx: EventContext): boolean {
        const res = ctx.lastDiffTypeEvent?.type === InteractiveEventType.pointerDown
            && event.type === InteractiveEventType.pointermove;
        if (!res) {
            return false;
        }
        const lastPoint = ctx.lastDiffTypeEvent!.globalPoint;
        if (GraphicUtils.distance(lastPoint, event.globalPoint)
            < this.deltaDistance / ctx.gmlRender.getScale()) {
            return false;
        }
        const streamRes=this.streamEnable(event, ctx);
        if(streamRes){
            this.locked=true;
            for(const streamProcessor of this.streamProcessor){
                streamProcessor.onStart(event, ctx);
            }
        }
        return streamRes;
    }

    work(event: InteractiveEvent, ctx: EventContext) {
        if(event.type===InteractiveEventType.pointermove){
            for(const streamProcessor of this.streamProcessor){
                streamProcessor.onMove(event, ctx);
            }
        }
        if(event.type===InteractiveEventType.pointerup){
            for(const streamProcessor of this.streamProcessor){
                streamProcessor.onUp(event, ctx);
            }
            this.locked=false;
        }
        super.work(event, ctx);
    }

    canBeExit(event: InteractiveEvent, ctx: EventContext): boolean {
        const res= !this.locked;
        if(res){
            this.stop(event, ctx);
        }
        return res;
    }


}