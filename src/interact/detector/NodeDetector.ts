import {AbsDetector} from "@/interact/detector/AbsDetector.ts";
import {GraphicNode} from "dahongpao-core";
import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent.ts";

export class NodeDetector extends AbsDetector<GraphicNode>{
    // @ts-ignore
    _onDetect(event: InteractiveEvent, ctx: EventContext): boolean {
        const globalPoint = event.globalPoint;
        const nodeList: GraphicNode[] = ctx.nodeManager.searchNodes(globalPoint.x, globalPoint.y);
        const target = nodeList.pop();
        this.result=target||null;
        return this.result!==null;
    }

}