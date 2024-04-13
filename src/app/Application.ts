import {GMLRender, IApplication, IPlugin} from "dahongpao-core";
import {CanvasRender} from "@/render/CanvasRender";
import {NodeManager} from "@/app/NodeManager.ts";

export class Application implements IApplication{

    gmlRender: GMLRender;
    //节点管理
    nodeManager:NodeManager;
    //插件
    plugins:IPlugin[]=[];

    constructor() {
        this.gmlRender=new CanvasRender();
        this.nodeManager=new NodeManager();
    }

    start(): void{
        for(const plugin of this.plugins){
            plugin.start();
        }
    }

    stop(): void{
        for(const plugin of this.plugins){
            plugin.stop();
        }
    }

    parse(text: string):void{
        if (text === "") {
            return;
        }

        const gmlData = this.gmlRender.parse2GMLData(text);
        this.nodeManager.setData(gmlData);
        this.gmlRender.drawData(this.nodeManager.nodeMap, this.nodeManager.lineMap);
    }

    redraw():void{
        this.gmlRender.drawData(this.nodeManager.nodeMap, this.nodeManager.lineMap);
    }

    registerPlugin(plugin:IPlugin){
        this.plugins.push(plugin);
    }
}