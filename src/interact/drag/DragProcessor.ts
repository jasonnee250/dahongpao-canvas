import {GraphicNode, GraphicUtils, Point, RectNode} from "dahongpao-core";
import {StreamProcessor} from "@/interact/processor/StreamProcessor";
import {EventContext} from "@/plugins/EventContext";
import {IGraphicElement} from "dahongpao-core/dist/graphic/IGraphicElement";
import {DetectorEnum} from "@/interact/detector/AbsDetector.ts";

export class DragProcessor extends StreamProcessor {

    lastPos: Point = new Point(0, 0);
    relatedLinks: Set<string> = new Set<string>();
    targetNode: GraphicNode | null = null;

    canBeExit(_event: PointerEvent, _eventCtx: EventContext): boolean {
        return this.canExit;
    }

    canBeEnable(event: PointerEvent, ctx: EventContext): boolean {
        const detector=ctx.detectors.get(DetectorEnum.Node);
        if(detector && detector.detect(event,ctx)){
            this.targetNode=detector.result;
            return true;
        }
        return false;
    }

    onDown(event: PointerEvent, ctx: EventContext): void {
        const globalPoint = this.getGlobalPoint(event, ctx);
        const nodeList: GraphicNode[] = ctx.nodeManager.searchNodes(globalPoint.x, globalPoint.y);
        const target = nodeList.pop();
        if (target) {
            this.relatedLinks=ctx.nodeManager.relatedLinkLine(target);
            for (const link of this.relatedLinks) {
                const line = ctx.nodeManager.lineMap.get(link);
                if (line) {
                    ctx.nodeManager.removeIndexNode(line.getRectNode());
                }
            }
            this.targetNode = target;
            this.lastPos = globalPoint;
        }
    }

    onMove(event: PointerEvent, ctx: EventContext): void {
        if (!this.targetNode) {
            return;
        }
        const globalPoint = this.getGlobalPoint(event,ctx);
        const delta = new Point(globalPoint.x - this.lastPos.x, globalPoint.y - this.lastPos.y);
        const prev = this.targetNode.getRectNode();
        //更新
        this.targetNode.x += delta.x;
        this.targetNode.y += delta.y;
        this.lastPos = globalPoint;
        //整理脏区bounds
        const dirtyBounds: RectNode[] = [];
        const current = this.targetNode.getRectNode();
        dirtyBounds.push(prev);
        dirtyBounds.push(current);

        //关联连线重绘
        for (const link of this.relatedLinks) {
            const prevLine = ctx.nodeManager.lineMap.get(link);
            if (prevLine) {
                const bounds = prevLine.getRectNode();
                dirtyBounds.push(bounds);
            }
            const linkLine = ctx.nodeManager.linkMap.get(link);
            if (!linkLine) {
                continue;
            }
            const line = ctx.gmlRender.layoutLine(ctx.nodeManager.nodeMap, linkLine);
            if (line) {
                ctx.nodeManager.lineMap.set(line.id, line);
                const bounds = line.getRectNode();
                dirtyBounds.push(bounds);
            }
        }
        const bounds = GraphicUtils.getBounds(dirtyBounds);
        this.bufferBounds(bounds,ctx);
        const result = ctx.nodeManager.tree.search(bounds);
        //整理需要重新绘制的对象
        const graphics=this.needDrawByMoving(ctx,result);
        ctx.gmlRender.dirtyDraw(bounds,graphics);
    }

    onUp(_event: PointerEvent, ctx: EventContext): void {
        if (this.targetNode) {
            //r tree更新
            ctx.nodeManager.tree.insert(this.targetNode.getRectNode());
        }
        for (const link of this.relatedLinks) {
            const line = ctx.nodeManager.lineMap.get(link);
            if (line) {
                //r tree剔除
                ctx.nodeManager.tree.insert(line.getRectNode());
            }
        }
        this.targetNode = null;
        this.relatedLinks.clear();
        this.lastPos.x = 0;
        this.lastPos.y = 0;
    }

    private getGlobalPoint(event: PointerEvent, ctx: EventContext): Point {
        const rect = ctx.gmlRender.canvas!.getBoundingClientRect()!;
        const point = new Point(event.clientX - rect.x, event.clientY - rect.y);
        return ctx.gmlRender.transformToGlobal(point);
    }

    private needDrawByMoving(ctx: EventContext,rectNodes:RectNode[]):IGraphicElement[]{
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of rectNodes) {
            const node = ctx.nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = ctx.nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        for (const lineId of this.relatedLinks) {
            const line = ctx.nodeManager.lineMap.get(lineId);
            if (line) {
                graphicSet.add(line);
            }
        }
        graphicSet.add(this.targetNode!);

        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        return graphicList;
    }

    private bufferBounds(bounds: RectNode,ctx: EventContext):void{
        const scale = ctx.gmlRender.globalTransform.a / 2;
        const buffer = 2;
        bounds.minX = Math.round((bounds.minX) * scale - buffer) / scale;
        bounds.minY = Math.round((bounds.minY) * scale - buffer) / scale;
        bounds.maxX = Math.round((bounds.maxX) * scale + 2 * buffer) / scale;
        bounds.maxY = Math.round((bounds.maxY) * scale + 2 * buffer) / scale;
    }




}