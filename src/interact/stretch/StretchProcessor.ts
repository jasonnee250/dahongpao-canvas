import {EventContext} from "@/plugins/EventContext";
import {StreamProcessor} from "@/interact/basic/StreamProcessor";
import {DetectorEnum} from "@/interact/detector/AbsDetector";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent";
import {GraphicUtils, Point, RectNode} from "dahongpao-core";
import {StretchInfo, StretchType} from "@/interact/detector/StretchDetector";
import {InteractiveUtils} from "@/interact/utils/InteractiveUtils";


export class StretchProcessor extends StreamProcessor {
    lastPos: Point = new Point(0, 0);
    target: StretchInfo | null = null;
    relatedLinks: Set<string> = new Set<string>();


    _onCanBeEnable(event: InteractiveEvent, eventCtx: EventContext):boolean{
        const detector = eventCtx.detectors.get(DetectorEnum.Stretch);
        if (detector && detector.detect(event, eventCtx)) {
            this.target = detector.result as StretchInfo;
            return true;
        }
        this.target = null;
        return false;
    }

    onStart(event: InteractiveEvent, ctx: EventContext): void {
        this.relatedLinks = InteractiveUtils.removeTargetFromIndexTreeAndFindRelatedLines(ctx.nodeManager, this.target!.node);
        this.lastPos = event.globalPoint;
    }

    onMove(event: InteractiveEvent, ctx: EventContext): void {
        if (!this.target) {
            return;
        }
        const targetNode = this.target.node;
        if(targetNode.w<10||targetNode.h<10){
            return;
        }
        const globalPoint = event.globalPoint;
        const delta = new Point(globalPoint.x - this.lastPos.x, globalPoint.y - this.lastPos.y);
        const prev = targetNode.getRectNode();
        //更新
        switch (this.target.type) {
            case StretchType.BOTTOM:
                targetNode.h += delta.y;
                break;
            case StretchType.LEFT:
                targetNode.x += delta.x;
                targetNode.w -= delta.x;
                break;
            case StretchType.RIGHT:
                targetNode.w += delta.x;
                break;
            case StretchType.TOP:
                targetNode.y += delta.y;
                targetNode.h -= delta.y;
                break;
            case StretchType.BOTTOM_LEFT:
                targetNode.h += delta.y;
                targetNode.x += delta.x;
                targetNode.w -= delta.x;
                break;
            case StretchType.BOTTOM_RIGHT:
                targetNode.h += delta.y;
                targetNode.w += delta.x;
                break;
            case StretchType.TOP_LEFT:
                targetNode.y += delta.y;
                targetNode.h -= delta.y;
                targetNode.x += delta.x;
                targetNode.w -= delta.x;
                break;
            case StretchType.TOP_RIGHT:
                targetNode.y += delta.y;
                targetNode.h -= delta.y;
                targetNode.w += delta.x;
                break;
            default:
                break;
        }
        this.lastPos = globalPoint;
        //整理脏区bounds
        const dirtyBounds: RectNode[] = [];
        const current = targetNode.getRectNode();
        dirtyBounds.push(prev);
        dirtyBounds.push(current);
        //关联连线重绘
        for (const linkId of this.relatedLinks) {
            InteractiveUtils.calculateRelatedLineDirtyBox(linkId,ctx,dirtyBounds);
        }
        const bounds = GraphicUtils.getBounds(dirtyBounds);
        InteractiveUtils.bufferBounds(bounds, ctx);
        //整理需要重新绘制的对象
        const graphics = InteractiveUtils.needDrawByMoving(ctx,bounds,this.relatedLinks,targetNode);
        ctx.gmlRender.dirtyDraw(bounds, graphics);
    }

    onUp(_event: InteractiveEvent, ctx: EventContext): void {
        InteractiveUtils.updateIndexTree(this.target?.node||null,this.relatedLinks,ctx);
        this.target = null;
        this.relatedLinks.clear();
        this.lastPos.x = 0;
        this.lastPos.y = 0;
    }

}