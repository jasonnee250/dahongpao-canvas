import {GraphicNode, GraphicNodeType, GraphicUtils, RectNode,TextAlignType} from 'dahongpao-core'
import ellipseDraw from "@/graphics/nodeDrawer/EllipseDrawer.ts";
import diamondDraw from "@/graphics/nodeDrawer/DiamondDrawer.ts";
import parallelogramDraw from "@/graphics/nodeDrawer/ParallelogramDrawer.ts";
import trapezoidDraw from "@/graphics/nodeDrawer/TrapezoidDrawer.ts";
import trianglDeraw from "@/graphics/nodeDrawer/TriangleDrawer.ts";
import rectDraw from "@/graphics/nodeDrawer/RectDrawer.ts";
import {BaseText} from "@/graphics/text/BaseText.ts";
import {TextInfo} from "@/graphics/text/TextInfo.ts";

export class CanvasGraphicNode extends GraphicNode {

    graphicContext: CanvasRenderingContext2D;
    textInfo: TextInfo=new TextInfo();

    parent:GraphicNode|null=null;

    static copyFrom(node: GraphicNode, ctx: CanvasRenderingContext2D): CanvasGraphicNode {
        const graphNode = new CanvasGraphicNode(node.id, ctx);
        const keys = Object.keys(node);
        for (const key of keys) {
            // @ts-ignore
            graphNode[key] = node[key];
        }
        return graphNode;
    }

    static generateText(id:string,ctx: CanvasRenderingContext2D):CanvasGraphicNode{
        const text=new CanvasGraphicNode(id, ctx);
        text.type=GraphicNodeType.Text;
        text.w=1;
        text.h=text.fontSize;
        return text;
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
        if(this.text===""){
            return;
        }
        this.drawText(this.graphicContext);
    }

    drawText(ctx: CanvasRenderingContext2D) {
        this.generateBaseText();
        const textFill = this.fontColor;
        ctx.fillStyle = textFill;
        ctx.globalAlpha = 1;
        ctx.font = this.fontSize.toString() + 'px Arial';
        this.graphicContext.textAlign = 'left';
        this.graphicContext.textBaseline = 'top';
        for(const text of this.textInfo.baseTextList){
            ctx.fillText(text.text, text.x, text.y);
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
        return {
            id:"text-bounds",
            minX:this.textInfo.x,
            minY:this.textInfo.y,
            maxX:this.textInfo.x+this.textInfo.width,
            maxY:this.textInfo.y+this.textInfo.height,
        }
    }

    generateBaseText() {
        const textList = this.text.split('\n');
        this.graphicContext.font = this.fontSize.toString() + 'px Arial';
        this.graphicContext.textAlign = 'left';
        this.graphicContext.textBaseline = 'top';
        this.textInfo.baseTextList = [];
        //测量文字尺寸
        let sumH=0;
        let sumW=0;
        const lineDelta=4;
        for (const text of textList) {
            const result = this.graphicContext.measureText(text);
            const height=result.actualBoundingBoxAscent + result.actualBoundingBoxDescent;
            const width=result.width;
            const baseText: BaseText = {
                text,
                height,
                width,
                x: 0,
                y: 0,
            }
            sumH=sumH+height+lineDelta;
            sumW=sumW>width?sumW:width;
            this.textInfo.baseTextList.push(baseText);
        }
        this.textInfo.width=sumW;
        this.textInfo.height=sumH;
        //进行文字布局
        let x=this.x;
        if(this.horizonAlign===TextAlignType.TOP_OR_LEFT){
            x=this.x;
        }else if(this.horizonAlign===TextAlignType.CENTER){
            x=this.x+0.5*this.w-0.5*sumW;
        }else if(this.horizonAlign===TextAlignType.BOTTOM_OR_RIGHT){
            x=this.x+this.w-sumW;
        }
        let y=this.y;
        if(this.verticalAlign===TextAlignType.TOP_OR_LEFT){
            y=this.y;
        }else if(this.verticalAlign===TextAlignType.CENTER){
            y=this.y+0.5*this.h-0.5*sumH;
        }else if(this.verticalAlign===TextAlignType.BOTTOM_OR_RIGHT){
            y=this.y+this.h-sumH;
        }
        this.textInfo.x=x;
        this.textInfo.y=y;
        for(const baseText of this.textInfo.baseTextList){
            baseText.x=x;
            baseText.y=y;
            y=y+baseText.height+lineDelta;
        }
    }
}