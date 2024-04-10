import {GraphicNode} from "dahongpao-core";

export default function rectDraw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#' + node.color.toString(16);
    ctx.globalAlpha = node.alpha;
    ctx.fillRect(node.x, node.y, node.w, node.h);
    if(Math.abs(node.borderAlpha)<1e-3){
        return;
    }
    ctx.strokeStyle = '#' + node.borderColor.toString(16);
    ctx.lineWidth = node.borderWidth;
    ctx.globalAlpha = node.borderAlpha;
    ctx.strokeRect(node.x, node.y, node.w, node.h);


}
