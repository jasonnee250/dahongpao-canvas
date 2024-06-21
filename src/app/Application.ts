import {GMLRender, IApplication, IPlugin, RectNode} from "dahongpao-core";
import {CanvasRender} from "@/render/CanvasRender";
import {NodeManager} from "@/app/NodeManager.ts";
import {IGraphicElement} from "dahongpao-core/dist/graphic/IGraphicElement";

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

    redrawWithinViewBounds(){
        const rectBounds: RectNode = this.gmlRender.getViewPortBounds();
        const ctx = this.gmlRender.canvas!.getContext("2d")!;
        ctx!.reset();
        const {a, b, c, d, e, f} = this.gmlRender.globalTransform;
        ctx.transform(a, b, c, d, e, f);

        ctx.clearRect(rectBounds.minX, rectBounds.minY, rectBounds.maxX - rectBounds.minX, rectBounds.maxY - rectBounds.minY);
        const result = this.nodeManager.tree.search(rectBounds);

        //整理需要重新绘制的对象
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = this.nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = this.nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        for (const graphic of graphicList) {
            graphic.draw();
        }
    }
}