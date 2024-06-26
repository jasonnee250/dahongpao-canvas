import {AbsSubMode} from "@/interact/basic/SubMode";
import {InteractiveEvent, InteractiveEventType} from "@/interact/basic/InteractiveEvent";
import {EventContext} from "@/plugins";
import {StreamProcessor} from "@/interact/basic/StreamProcessor";
import {IProcessor} from "@/interact/basic/IProcessor";

export abstract class StreamMode extends AbsSubMode{

    streamProcessor:StreamProcessor[];

    locked:boolean=false;

    constructor(streamProcessor:StreamProcessor[],processors:IProcessor[]=[]) {
        super(processors);
        this.streamProcessor=streamProcessor;
    }


    abstract streamEnable(event: InteractiveEvent, ctx: EventContext):boolean;

    canBeEnable(event: InteractiveEvent, ctx: EventContext): boolean {

        if(event.type!==InteractiveEventType.pointerDown){
            return false;
        }
        const res=this.streamEnable(event, ctx);
        if(res){
            this.locked=true;
        }
        return res;
    }

    work(event: InteractiveEvent, ctx: EventContext) {
        if(event.type===InteractiveEventType.pointerDown){
            for(const streamProcessor of this.streamProcessor){
                streamProcessor.onStart(event, ctx);
            }
        }
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