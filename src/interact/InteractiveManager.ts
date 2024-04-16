import {IProcessor} from "./basic/IProcessor";
import {EventContext} from "@/plugins/EventContext";
import {IConfig} from "./config/IConfig.ts";
import {InteractiveEvent} from "./basic/InteractiveEvent.ts";
import {Point} from "dahongpao-core";

export class InteractiveManager {

    processors:IProcessor[]=[];
    currentProcessor:IProcessor|null=null;

    constructor(config:IConfig) {
        this.processors=config.processors;
    }

    onEvent(event:PointerEvent,ctx:EventContext):void{
        //reset
        this._reset(ctx);
        const interactiveEvent=this._convertInteractiveEvent(event,ctx);
        //选择
        if(!this.currentProcessor){
            this.currentProcessor=this.selectProcessor(interactiveEvent,ctx);
        }
        if(!this.currentProcessor){
            return;
        }
        //执行
        this.currentProcessor.process(interactiveEvent,ctx);
        //执行后判断
        if(this.currentProcessor.canBeExit(interactiveEvent,ctx)){
            this.currentProcessor=null;
        }
    }

    selectProcessor(event:InteractiveEvent,ctx:EventContext):IProcessor|null{
        for(const processor of this.processors){
            if(processor.canBeEnable(event,ctx)){
                return processor;
            }
        }
        return null;
    }

    private _reset(ctx:EventContext){
        for(const [_type,detector] of ctx.detectors){
            detector.reset();
        }
    }

    private _convertInteractiveEvent(event:PointerEvent,ctx:EventContext):InteractiveEvent{
        const rect = ctx.gmlRender.canvas!.getBoundingClientRect()!;
        const point = new Point(event.clientX - rect.x, event.clientY - rect.y);
        const globalPoint= ctx.gmlRender.transformToGlobal(point);
        return {
            clientPoint:new Point(event.clientX,event.clientY),
            globalPoint:globalPoint,
            type:event.type,
            originEvent:event,
        }
    }

}