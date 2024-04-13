import {IPlugin} from "dahongpao-core";
import {EventContext} from "@/plugins/EventContext";
import {InteractiveManager} from "@/interact/InteractiveManager";
import {IConfig} from "@/interact/config/IConfig.ts";

export class PointerEventPlugin implements IPlugin{

    eventCtx:EventContext;
    interactiveManager:InteractiveManager;

    constructor(eventCtx:EventContext,config:IConfig) {
        this.eventCtx=eventCtx;
        this.interactiveManager=new InteractiveManager(config);
    }

    start(): void {
        document.addEventListener("pointerdown", this.onPointerDown);
        document.addEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointerup", this.onPointerUp);
    }
    stop(): void {
        document.removeEventListener("pointerdown", this.onPointerDown);
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    onPointerDown = (event: PointerEvent) => {
        this.triggerEvent(event);
    }
    onPointerMove = (event: PointerEvent) => {
        this.triggerEvent(event);
    }
    onPointerUp = (event: PointerEvent) => {
        this.triggerEvent(event);
    }
    private triggerEvent(event:PointerEvent):void{
        this.interactiveManager.onEvent(event,this.eventCtx);
    }


}