import {AbsDetector} from "@/interact/detector/AbsDetector.ts";
import {GraphicNode} from "dahongpao-core";
import {EventContext} from "@/plugins/EventContext";

export class NodeDetector extends AbsDetector<GraphicNode>{
    // @ts-ignore
    onDetect(event: PointerEvent, ctx: EventContext): boolean {
        const globalPoint = ctx.gmlRender.getGlobalPoint(event as any);
        const nodeList: GraphicNode[] = ctx.nodeManager.searchNodes(globalPoint.x, globalPoint.y);
        const target = nodeList.pop();
        this.result=target||null;
        return this.result!==null;
    }

}