import {AbsDetector, DetectorEnum} from "@/interact/detector/AbsDetector";
import {GraphicNode, GraphicUtils} from "dahongpao-core";
import {EventContext} from "@/plugins/EventContext";
import {InteractiveUtils} from "@/interact/utils/InteractiveUtils";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent";
import {StretchHotBuffer} from "@/interact/basic/constants.ts";

export enum StretchType {
    TOP,
    LEFT,
    BOTTOM,
    RIGHT,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

export interface StretchInfo {
    node: GraphicNode,
    type: StretchType,
}

export class StretchDetector extends AbsDetector<StretchInfo> {
    _onDetect(event: InteractiveEvent, ctx: EventContext): boolean {
        const detector=ctx.detectors.get(DetectorEnum.Node);
        if(detector && detector.detect(event,ctx)){
            const node=detector.result as GraphicNode;
            if(InteractiveUtils.overlapPoint(GraphicUtils.topLeft(node),event.globalPoint)){
                this.result={
                    node,
                    type:StretchType.TOP_LEFT,
                }
                return true;
            }
            if(InteractiveUtils.overlapPoint(GraphicUtils.topRight(node),event.globalPoint)){
                this.result={
                    node,
                    type:StretchType.TOP_RIGHT,
                }
                return true;
            }
            if(InteractiveUtils.overlapPoint(GraphicUtils.bottomRight(node),event.globalPoint)){
                this.result={
                    node,
                    type:StretchType.BOTTOM_RIGHT,
                }
                return true;
            }
            if(InteractiveUtils.overlapPoint(GraphicUtils.bottomLeft(node),event.globalPoint)){
                this.result={
                    node,
                    type:StretchType.BOTTOM_LEFT,
                }
                return true;
            }
            const topContain=GraphicUtils.rectContains2(event.globalPoint,
                {minX:node.x,minY:node.y-StretchHotBuffer,maxX:node.x+node.w,maxY:node.y+StretchHotBuffer*2}
            );
            if(topContain){
                this.result={
                    node,
                    type:StretchType.TOP,
                }
                return true;
            }

            const rightContain=GraphicUtils.rectContains2(event.globalPoint,
                {minX:node.x+node.w-StretchHotBuffer,minY:node.y,maxX:node.x+node.w+StretchHotBuffer,maxY:node.y+node.w}
            );
            if(rightContain){
                this.result={
                    node,
                    type:StretchType.RIGHT,
                }
                return true;
            }

            const bottomContain=GraphicUtils.rectContains2(event.globalPoint,
                {minX:node.x,minY:node.y+node.h-StretchHotBuffer,maxX:node.x+node.w,maxY:node.y+node.h+StretchHotBuffer}
            );
            if(bottomContain){
                this.result={
                    node,
                    type:StretchType.BOTTOM,
                }
                return true;
            }
            const leftContain=GraphicUtils.rectContains2(event.globalPoint,
                {minX:node.x-StretchHotBuffer,minY:node.y,maxX:node.x+StretchHotBuffer,maxY:node.y+node.h}
            );
            if(leftContain){
                this.result={
                    node,
                    type:StretchType.LEFT,
                }
                return true;
            }
        }
        this.result=null;
        return false;
    }
    
}