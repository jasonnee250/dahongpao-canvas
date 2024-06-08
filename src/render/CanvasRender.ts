import {
    CurveLineLayout,
    GMLRender,
    GraphLineType,
    GraphicLanguageParser,
    ILineLayout,
    LineLayout,
    PolyLineLayout,
    GraphicNode,
    GraphLinkLine,
    IGraphicLine,
    SimpleLine, PolyLine, CurveLine,
    GMLData, Point, RectNode, AffineMatrix
} from "dahongpao-core";
import {CanvasSimpleLine} from "@/graphics/line/CanvasSimpleLine";
import {CanvasPolyLine} from "@/graphics/line/CanvasPolyLine";
import {CanvasCurveLine} from "@/graphics/line/CanvasCurveLine";
import {CanvasGraphicNode} from "@/graphics/CanvasGraphicNode";

/**
 * 主管渲染的GMLApp
 */
export class CanvasRender implements GMLRender {
    parser: GraphicLanguageParser;

    layoutMap: Map<GraphLineType, ILineLayout>;

    globalTransform: AffineMatrix = AffineMatrix.generateMatrix();
    canvas:HTMLCanvasElement|null=null;

    constructor() {
        this.parser = new GraphicLanguageParser();
        this.layoutMap = new Map<GraphLineType, ILineLayout>();
        this.layoutMap.set(GraphLineType.Line, new LineLayout());
        this.layoutMap.set(GraphLineType.PolyLine, new PolyLineLayout());
        this.layoutMap.set(GraphLineType.Curve, new CurveLineLayout());
        this.globalTransform.a = window.devicePixelRatio;
        this.globalTransform.d = window.devicePixelRatio;
    }

    init(element: HTMLCanvasElement) {
        this.canvas=element;
        const ctx = this.canvas.getContext("2d")!;
        const {a, b, c, d, e, f} = this.globalTransform;
        ctx.transform(a, b, c, d, e, f);
    }

    reset() {
        if(!this.canvas){
            console.error("Error! The canvas is null!");
            return;
        }
        const ctx = this.canvas.getContext("2d")!;
        ctx!.reset();
        const {a, b, c, d, e, f} = this.globalTransform;
        ctx.transform(a, b, c, d, e, f);
    }

    layoutLine(nodeMap:Map<string,GraphicNode>, linkLine:GraphLinkLine):IGraphicLine|null{
        const layout = this.layoutMap.get(linkLine.type);
        if (!layout) {
            return null;
        }
        const line = layout.layout(nodeMap, linkLine);
        if (!line) {
            return null;
        }
        const ctx=this.canvas!.getContext("2d");
        if (line instanceof SimpleLine) {
            return CanvasSimpleLine.copyFrom(line,ctx!);
        } else if (line instanceof PolyLine) {
            return CanvasPolyLine.copyFrom(line,ctx!);
        }else if (line instanceof CurveLine) {
            return CanvasCurveLine.copyFrom(line,ctx!);
        }
        return null;
    }

    parse2GMLData(text: string): GMLData {
        this.parser.parseString(text);
        const ctx=this.canvas!.getContext("2d");

        const nodeMap=this.parser.listener.nodeMap;
        const linkMap=this.parser.listener.linkMap;
        const lineMap=new Map<string,IGraphicLine>();
        const renderNodeMap=new Map<string,GraphicNode>();
        for (const [_, node] of nodeMap) {
            const renderNode = CanvasGraphicNode.copyFrom(node,ctx!);
            renderNodeMap.set(renderNode.id,renderNode);
        }
        for (const [_, linkLine] of linkMap) {
            const renderLine=this.layoutLine(nodeMap,linkLine);
            if(renderLine){
                lineMap.set(renderLine.id,renderLine);
            }
        }
        return {
            nodeMap:renderNodeMap,
            linkMap,
            lineMap,
        }
    }

    draw(text: string) {
        this.reset();

        const ctx=this.canvas!.getContext("2d");
        this.parser.parseString(text);
        const nodeMap = this.parser.listener.nodeMap;
        const linkMap = this.parser.listener.linkMap;
        for (const [_, node] of nodeMap) {
            const renderNode = CanvasGraphicNode.copyFrom(node,ctx!);
            renderNode.draw();
        }
        for (const [_, linkLine] of linkMap) {
            const renderLine=this.layoutLine(nodeMap,linkLine);
            if(renderLine){
                renderLine.draw();
            }
        }
    }

    drawData(nodeMap: Map<string, GraphicNode>, lineMap: Map<string, IGraphicLine>) {
        this.reset();
        for (const [_, node] of nodeMap) {
            node.draw();
        }
        for (const [_, node] of lineMap) {
            node.draw();
        }
    }

    scale(sx:number,sy:number):void{
        this.globalTransform.a*=sx;
        this.globalTransform.d*=sy;
    }

    translation(dx:number,dy:number):void{
        this.globalTransform.e+=dx;
        this.globalTransform.f+=dy;
    }

    resetTransform():void{
        this.globalTransform=AffineMatrix.generateMatrix();
        this.globalTransform.a = window.devicePixelRatio;
        this.globalTransform.d = window.devicePixelRatio;
    }


    transformToGlobal(point:Point):Point{
        point.x = point.x * window.devicePixelRatio;
        point.y = point.y * window.devicePixelRatio;
        const {a, d, e, f} = this.globalTransform;
        point.x = point.x / a - e / a;
        point.y = point.y / d - f / d;
        return point;
    }

    dirtyDraw(bounds: RectNode,graphicList:GraphicNode[]){
        const ctx = this.canvas!.getContext("2d")!;
        //清空；
        ctx.clearRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
        ctx.save();
        ctx.beginPath();
        ctx.rect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
        ctx.clip();
        for (const graphic of graphicList) {
            graphic.draw();
        }
        ctx.restore();
    }

    getViewPortBounds(){
        const rect = this.canvas!.getBoundingClientRect();
        const point = new Point(rect.width,rect.height);
        const start = this.transformToGlobal(new Point(0, 0));
        const globalPoint = this.transformToGlobal(point);
        const buffer=2;
        const rectBounds: RectNode = {
            id: 'rect',
            minX: start.x-buffer,
            minY: start.y-buffer,
            maxX: globalPoint.x+2*buffer,
            maxY: globalPoint.y+2*buffer,
        }
        return rectBounds;
    }

    getGlobalPoint(event: PointerEvent): Point {
        const rect = this.canvas!.getBoundingClientRect()!;
        const point = new Point(event.clientX - rect.x, event.clientY - rect.y);
        return this.transformToGlobal(point);
    }

    getScale():number{
        return this.globalTransform.a;
    }

}