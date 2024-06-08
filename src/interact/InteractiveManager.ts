import {EventContext} from "@/plugins/EventContext";
import {IConfig} from "./config/IConfig.ts";
import {InteractiveEvent, InteractiveEventType} from "./basic/InteractiveEvent.ts";
import {Point} from "dahongpao-core";
import {AbsMainMode} from "@/interact/basic/MainMode.ts";

export class InteractiveManager {

    modes:AbsMainMode[]=[];
    currentMode:AbsMainMode;

    constructor(config:IConfig) {
        this.modes=config.modes;
        this.currentMode=config.modes[config.modes.length-1];
    }

    /** 当前模式执行之后判断要不要退出该模式 */
    onEvent(event:PointerEvent,ctx:EventContext):void{
        //reset
        this._reset(ctx);
        const interactiveEvent=this._convertInteractiveEvent(event,ctx);
        this.detect(interactiveEvent,ctx);
        this.currentMode.work(interactiveEvent,ctx);
        this._record(interactiveEvent,ctx);
    }

    detect(event:InteractiveEvent,ctx:EventContext):void{
        /** 当前子模式不能退出，仍在当前子模式下执行事件 */
        if(!this.currentMode.canBeExit(event,ctx)){
            return;
        }
        /** 当前子模式能退出，重新寻找能够执行的子模式 */
        for(const mode of this.modes){
            if(mode.canBeEnable(event,ctx)){
                this.currentMode=mode;
                return;
            }
        }
    }

    private _reset(ctx:EventContext){
        for(const [_type,detector] of ctx.detectors){
            detector.reset();
        }
    }

    private _record(event:InteractiveEvent,ctx:EventContext):void{
        ctx.lastInteractiveEvent=event;
    }

    private _convertInteractiveEvent(event:PointerEvent,ctx:EventContext):InteractiveEvent{
        const rect = ctx.gmlRender.canvas!.getBoundingClientRect()!;
        const point = new Point(event.clientX - rect.x, event.clientY - rect.y);
        const globalPoint= ctx.gmlRender.transformToGlobal(point);
        return {
            clientPoint:new Point(event.clientX,event.clientY),
            globalPoint:globalPoint,
            type:this._convertEventType(event.type),
            originEvent:event,
        }
    }

    private _convertEventType(type:string):InteractiveEventType{
        if(type==="pointerdown"){
            return InteractiveEventType.pointerDown;
        }
        if(type==="pointermove"){
            return InteractiveEventType.pointermove;
        }
        if(type==="pointerup"){
            return InteractiveEventType.pointerup;
        }
        return InteractiveEventType.unknown;
    }

}