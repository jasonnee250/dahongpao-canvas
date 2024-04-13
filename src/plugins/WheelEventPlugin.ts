import {IPlugin, RectNode} from "dahongpao-core";
import {EventContext} from "@/plugins/EventContext";
import {IGraphicElement} from "dahongpao-core/dist/graphic/IGraphicElement";

export class WheelEventPlugin implements IPlugin{

    eventCtx:EventContext;
    constructor(eventCtx:EventContext) {
        this.eventCtx=eventCtx;
    }
    start(): void {
        document.addEventListener("wheel", this.onWheel, {passive: false});
    }
    stop(): void {
        document.removeEventListener("wheel", this.onWheel);
    }

    onWheel = (event: WheelEvent) => {
        if (event.target === this.eventCtx.gmlRender.canvas) {
            event.preventDefault();
        } else {
            return;
        }
        if (event.ctrlKey) {
            //缩放
            const delta = Math.abs(event.deltaY) / 100;
            const scale = event.deltaY > 0 ? (1 - delta) : (1 + delta);
            this.eventCtx.gmlRender.scale(scale, scale);
        } else {
            //平移
            this.eventCtx.gmlRender.translation(-event.deltaX, -event.deltaY);
        }
        const ctx = this.eventCtx.gmlRender.canvas!.getContext("2d")!;

        const rectBounds: RectNode = this.eventCtx.gmlRender.getViewPortBounds();
        const {a, b, c, d, e, f} = this.eventCtx.gmlRender.globalTransform;
        ctx.setTransform(a, b, c, d, e, f);

        ctx.clearRect(rectBounds.minX, rectBounds.minY, rectBounds.maxX - rectBounds.minX, rectBounds.maxY - rectBounds.minY);
        const result = this.eventCtx.nodeManager.tree.search(rectBounds);

        //整理需要重新绘制的对象
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = this.eventCtx.nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = this.eventCtx.nodeManager.lineMap.get(treeNode.id);
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