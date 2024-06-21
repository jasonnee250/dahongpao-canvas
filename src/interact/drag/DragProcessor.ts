import {GraphicNode, GraphicUtils, Point, RectNode} from "dahongpao-core";
import {StreamProcessor} from "@/interact/basic/StreamProcessor";
import {EventContext} from "@/plugins/EventContext";
import {DetectorEnum} from "@/interact/detector/AbsDetector.ts";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent.ts";
import {InteractiveUtils} from "@/interact/utils/InteractiveUtils.ts";

export class DragProcessor extends StreamProcessor {

    lastPos: Point = new Point(0, 0);
    relatedLinks: Set<string> = new Set<string>();
    targetNode: GraphicNode | null = null;

    _onCanBeEnable(event: InteractiveEvent, ctx: EventContext):boolean{
        const detector = ctx.detectors.get(DetectorEnum.Node);
        if (detector && detector.detect(event, ctx)) {
            this.targetNode = detector.result;
            return true;
        }
        return false;
    }

    onDown(event: InteractiveEvent, ctx: EventContext): void {
        this.relatedLinks = InteractiveUtils.removeTargetFromIndexTreeAndFindRelatedLines(ctx.nodeManager,this.targetNode!);
        this.lastPos = event.globalPoint;
    }

    onMove(event: InteractiveEvent, ctx: EventContext): void {
        if (!this.targetNode) {
            return;
        }
        const globalPoint = event.globalPoint;
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
        for (const linkId of this.relatedLinks) {
            InteractiveUtils.calculateRelatedLineDirtyBox(linkId,ctx,dirtyBounds);
        }
        const bounds = GraphicUtils.getBounds(dirtyBounds);
        InteractiveUtils.bufferBounds(bounds, ctx);
        //整理需要重新绘制的对象
        const graphics = InteractiveUtils.needDrawByMoving(ctx,bounds,this.relatedLinks,this.targetNode);
        ctx.gmlRender.dirtyDraw(bounds, graphics);
    }

    onUp(_event: InteractiveEvent, ctx: EventContext): void {
        InteractiveUtils.updateIndexTree(this.targetNode||null,this.relatedLinks,ctx);
        this.targetNode = null;
        this.relatedLinks.clear();
        this.lastPos.x = 0;
        this.lastPos.y = 0;
    }

}