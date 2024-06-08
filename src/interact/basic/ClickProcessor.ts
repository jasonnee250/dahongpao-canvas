import {EventContext} from "@/plugins";
import {IProcessor} from "src/interact/basic/IProcessor";
import {InteractiveEvent, InteractiveEventType} from "./InteractiveEvent";
import {ClickHandler} from "src/interact/basic/ClickHandler";

export abstract class ClickProcessor implements IProcessor {

    downHandlers:ClickHandler[]=[];
    upHandlers:ClickHandler[]=[];

    registerDownHandler(handler:ClickHandler):void{
        this.downHandlers.push(handler);
    }
    registerUpHandler(handler:ClickHandler):void{
        this.upHandlers.push(handler);
    }
    process(event: InteractiveEvent, eventCtx: EventContext): void {
        if(event.type===InteractiveEventType.pointerDown){
            for(const handler of this.downHandlers){
                if(handler.enable(event, eventCtx)){
                    handler.handle(event, eventCtx);
                    return;
                }
            }
        }
        if(event.type===InteractiveEventType.pointerup){
            for(const handler of this.upHandlers){
                if(handler.enable(event, eventCtx)){
                    handler.handle(event, eventCtx);
                    return;
                }
            }
        }
    }



}