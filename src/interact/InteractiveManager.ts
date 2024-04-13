import {IProcessor} from "@/interact/processor/IProcessor";
import {EventContext} from "@/plugins/EventContext";
import {IConfig} from "@/interact/config/IConfig.ts";

export class InteractiveManager {

    processors:IProcessor[]=[];
    currentProcessor:IProcessor|null=null;

    constructor(config:IConfig) {
        this.processors=config.processors;
    }

    onEvent(event:PointerEvent,ctx:EventContext):void{
        //reset
        this.reset(ctx);
        //选择
        if(!this.currentProcessor){
            this.currentProcessor=this.selectProcessor(event,ctx);
        }
        //执行
        this.currentProcessor.process(event,ctx);
        //执行后判断
        if(this.currentProcessor.canBeExit(event,ctx)){
            this.currentProcessor=null;
        }
    }

    selectProcessor(event:PointerEvent,ctx:EventContext){
        for(const processor of this.processors){
            if(processor.canBeEnable(event,ctx)){
                return processor;
            }
        }
        return this.processors[this.processors.length-1];
    }

    reset(ctx:EventContext){
        for(const [_type,detector] of ctx.detectors){
            detector.reset();
        }
    }

}