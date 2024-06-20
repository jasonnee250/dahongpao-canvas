import {GraphicNode} from "dahongpao-core";

export default function ellipseDraw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = node.color;
    ctx.globalAlpha = node.alpha;
    ctx.beginPath();
    ctx.ellipse(node.x + 0.5 * node.w, node.y + 0.5 * node.h, 0.5 * node.w, 0.5 * node.h, 0, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.strokeStyle =  node.borderColor;
    ctx.lineWidth = node.borderWidth;
    ctx.globalAlpha = node.borderAlpha;
    ctx.closePath();
    ctx.fill();
    ctx.stroke();


}