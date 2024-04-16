import {AbsNodeManager, GraphicNode, Point, RectNode} from "dahongpao-core";
import {EventContext} from "@/plugins/EventContext.ts";
import {IGraphicElement} from "dahongpao-core/dist/graphic/IGraphicElement";

export class InteractiveUtils {

    static overlapPoint(p1:Point,p2:Point,threshold:number=5):boolean{
        return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y)<threshold*threshold;
    }

    /**
     * 在索引树中去除正在操作的节点，并且计算和这些节点相关联的连线，
     * 同时返回这些连线
     * @param nodeManager
     * @param targetNode
     */
    static removeTargetFromIndexTreeAndFindRelatedLines(nodeManager:AbsNodeManager,targetNode:GraphicNode):Set<string>{
        const lines= nodeManager.relatedLinkLine(targetNode);
        for (const link of lines) {
            const line = nodeManager.lineMap.get(link);
            if (line) {
                nodeManager.removeIndexNode(line.getRectNode());
            }
        }
        nodeManager.removeIndexNode(targetNode.getRectNode());
        return lines;
    }

    static calculateRelatedLineDirtyBox(link:string,ctx:EventContext,dirtyBounds:RectNode[]){
        const prevLine = ctx.nodeManager.lineMap.get(link);
        if (prevLine) {
            const bounds = prevLine.getRectNode();
            dirtyBounds.push(bounds);
        }
        const linkLine = ctx.nodeManager.linkMap.get(link);
        if (!linkLine) {
            return;
        }
        const line = ctx.gmlRender.layoutLine(ctx.nodeManager.nodeMap, linkLine);
        if (line) {
            ctx.nodeManager.lineMap.set(line.id, line);
            const bounds = line.getRectNode();
            dirtyBounds.push(bounds);
        }
    }

    static bufferBounds(bounds: RectNode, ctx: EventContext,buffer:number=2): void {
        const scale = ctx.gmlRender.globalTransform.a / 2;
        bounds.minX = Math.round((bounds.minX) * scale - buffer) / scale;
        bounds.minY = Math.round((bounds.minY) * scale - buffer) / scale;
        bounds.maxX = Math.round((bounds.maxX) * scale + 2 * buffer) / scale;
        bounds.maxY = Math.round((bounds.maxY) * scale + 2 * buffer) / scale;
    }

    static needDrawByMoving(ctx: EventContext, bounds: RectNode,relatedLinks:Set<string>,targetNode:GraphicNode): IGraphicElement[] {
        const result = ctx.nodeManager.tree.search(bounds);
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = ctx.nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = ctx.nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        for (const lineId of relatedLinks) {
            const line = ctx.nodeManager.lineMap.get(lineId);
            if (line) {
                graphicSet.add(line);
            }
        }
        graphicSet.add(targetNode!);
        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        return graphicList;
    }

    static updateIndexTree(targetNode:GraphicNode|null,relatedLinks:Set<string>,ctx: EventContext){
        if (targetNode) {
            //r tree更新
            ctx.nodeManager.addIndexNode(targetNode.getRectNode());
        }
        for (const link of relatedLinks) {
            const line = ctx.nodeManager.lineMap.get(link);
            if (line) {
                //r tree剔除
                ctx.nodeManager.addIndexNode(line.getRectNode());
            }
        }
    }

}