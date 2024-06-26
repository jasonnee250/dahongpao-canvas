import {EventContext} from "@/plugins";
import {IProcessor} from "@/interact/basic/IProcessor";
import {InteractiveEvent, InteractiveEventType} from "./InteractiveEvent";
import {ClickHandler} from "@/interact/basic/ClickHandler";

export abstract class ClickProcessor implements IProcessor {

    downHandlers:ClickHandler[]=[];
    upHandlers:ClickHandler[]=[];

    hasWorking:boolean=false;

    allowEventTypeSet=new Set([
        InteractiveEventType.pointerDown,
        InteractiveEventType.pointerup,
    ])

    registerDownHandler(handler:ClickHandler):void{
        this.downHandlers.push(handler);
    }
    registerUpHandler(handler:ClickHandler):void{
        this.upHandlers.push(handler);
    }
    process(event: InteractiveEvent, eventCtx: EventContext): void {

        this.downProcess(event,eventCtx);
        this.upProcess(event,eventCtx);
    }

    stop(_event: InteractiveEvent, _eventCtx: EventContext):void{
        this.hasWorking=false;
    }

    downProcess(event: InteractiveEvent, eventCtx: EventContext): void{
        if(event.type===InteractiveEventType.pointerDown){
            for(const handler of this.downHandlers){
                if(handler.enable(event, eventCtx)){
                    this.hasWorking=true;
                    handler.handle(event, eventCtx);
                    return;
                }
            }
        }
    }

    upProcess(event: InteractiveEvent, eventCtx: EventContext): void{
        if(event.type===InteractiveEventType.pointerup){
            if(this.hasWorking){
                this.hasWorking=false;
                return;
            }
            for(const handler of this.upHandlers){
                if(handler.enable(event, eventCtx)){
                    handler.handle(event, eventCtx);
                    return;
                }
            }
        }
    }



}