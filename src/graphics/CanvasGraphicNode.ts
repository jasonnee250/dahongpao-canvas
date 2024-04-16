import {GraphicNode, GraphicNodeType, GraphicUtils, RectNode,TextAlignType} from 'dahongpao-core'
import ellipseDraw from "@/graphics/nodeDrawer/EllipseDrawer.ts";
import diamondDraw from "@/graphics/nodeDrawer/DiamondDrawer.ts";
import parallelogramDraw from "@/graphics/nodeDrawer/ParallelogramDrawer.ts";
import trapezoidDraw from "@/graphics/nodeDrawer/TrapezoidDrawer.ts";
import trianglDeraw from "@/graphics/nodeDrawer/TriangleDrawer.ts";
import rectDraw from "@/graphics/nodeDrawer/RectDrawer.ts";

export class CanvasGraphicNode extends GraphicNode {

    graphicContext: CanvasRenderingContext2D;

    static copyFrom(node: GraphicNode, ctx: CanvasRenderingContext2D): CanvasGraphicNode {
        const graphNode = new CanvasGraphicNode(node.id, ctx);
        const keys = Object.keys(node);
        for (const key of keys) {
            // @ts-ignore
            graphNode[key] = node[key];
        }
        return graphNode;
    }

    static generateText(id:string,ctx: CanvasRenderingContext2D){
        const text=new CanvasGraphicNode(id, ctx);
        text.type=GraphicNodeType.Text;
        text.horizonAlign=TextAlignType.TOP_OR_LEFT;
        text.verticalAlign=TextAlignType.TOP_OR_LEFT;
    }

    constructor(id: string, ctx: CanvasRenderingContext2D) {
        super(id);
        this.graphicContext = ctx;
    }

    draw(): void {
        switch (this.type) {
            case GraphicNodeType.Circle:
                ellipseDraw(this, this.graphicContext);
                break;
            case GraphicNodeType.Diamond:
                diamondDraw(this, this.graphicContext);
                break;
            case GraphicNodeType.Parallelogram:
                parallelogramDraw(this, this.graphicContext);
                break;
            case GraphicNodeType.Trapezoid:
                trapezoidDraw(this, this.graphicContext);
                break;
            case GraphicNodeType.Triangle:
                trianglDeraw(this, this.graphicContext);
                break;
            case GraphicNodeType.Text:
                break;
            case GraphicNodeType.Rect:
            default:
                rectDraw(this, this.graphicContext);
        }
        this.drawText(this.graphicContext);
    }

    drawText(ctx: CanvasRenderingContext2D) {
        const textFill = '#' + this.fontColor.toString(16);
        ctx.fillStyle = textFill === '#0' ? '#000000' : textFill;
        ctx.globalAlpha = 1;
        ctx.font = this.fontSize.toString() + 'px Arial';
        const textBounds=this.getTextBounds();
        const textList=this.text.split('\n');
        const x=textBounds.minX;
        let y=textBounds.minY;
        const delta=4;
        for(const text of textList){
            ctx.fillText(text, x, y);
            const result = this.graphicContext.measureText(text);
            const height = result.actualBoundingBoxAscent + result.actualBoundingBoxDescent;
            y=y+height+delta;
        }
    }

    getRectNode(): RectNode {
        const bounds: RectNode = super.getRectNode();
        if (this.text === "") {
            return bounds;
        }
        const treeBounds: RectNode = this.getTextBounds();
        return GraphicUtils.getBounds([bounds,treeBounds],this.id);
    }

    getTextBounds():RectNode{
        this.graphicContext.font = this.fontSize.toString() + 'px Arial';
        const textList=this.text.split('\n');
        let sumH=0;
        let sumW=0;
        const delta=4;
        for(const text of textList){
            const result = this.graphicContext.measureText(text);
            const width = result.width;
            const height = result.actualBoundingBoxAscent + result.actualBoundingBoxDescent;
            sumH=sumH+height+delta;
            sumW=width>sumW?width:sumW;
        }
        sumH+=20;
        //计算x
        let x=this.x;
        let y=this.y;
        switch (this.horizonAlign){
            case TextAlignType.TOP_OR_LEFT:
                break;
            case TextAlignType.BOTTOM_OR_RIGHT:
                x=this.x+this.w-sumW;
                break;
            case TextAlignType.CENTER:
            default:
                x=this.x+0.5*this.w-0.5*sumW;
                break;
        }
        switch (this.verticalAlign){
            case TextAlignType.TOP_OR_LEFT:
                break;
            case TextAlignType.BOTTOM_OR_RIGHT:
                y=this.y+this.h-sumH;
                break;
            case TextAlignType.CENTER:
            default:

                y=this.y+0.5*this.h-0.5*sumH;
                break;
        }
        return {
            id:"text-bounds",
            minX:x,
            minY:y,
            maxX:x+sumW,
            maxY:y+sumH,
        }

    }
}