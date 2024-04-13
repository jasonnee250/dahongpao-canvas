import {Application} from "@/app/Application";
import {PointerEventPlugin} from "@/plugins";
import {EventContext} from "@/plugins/EventContext";
import {WheelEventPlugin} from "@/plugins/WheelEventPlugin.ts";
import {NormalConfig} from "@/interact/config/NormalConfig.ts";

export class ExampleApp {

    application:Application;

    constructor() {
        this.application=new Application();
        const config=new NormalConfig();
        const ctx:EventContext={
            nodeManager:this.application.nodeManager,
            gmlRender:this.application.gmlRender,
            detectors:config.detectors,
        }
        const eventPlugin=new PointerEventPlugin(ctx,config);
        const wheelPlugin=new WheelEventPlugin(ctx);
        this.application.registerPlugin(eventPlugin);
        this.application.registerPlugin(wheelPlugin);

    }

    start():void{
        this.application.start();
    }

    stop():void{
        this.application.stop();
    }

}