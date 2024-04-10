import {AbsNodeManager, GraphicNode, GraphLinkLine, IGraphicLine, RectNode} from "dahongpao-core";
import RBush from "rbush";
import {GMLData} from "dahongpao-core/src/render/GMLRender";

export class NodeManager extends AbsNodeManager{
    nodeMap: Map<string, GraphicNode>;
    linkMap: Map<string, GraphLinkLine>;
    lineMap: Map<string, IGraphicLine>;
    //r 树
    tree :RBush<RectNode>;


    constructor() {
        super();
        this.nodeMap=new Map<string, GraphicNode>();
        this.linkMap=new Map<string, GraphLinkLine>();
        this.lineMap=new Map<string, IGraphicLine>();
        this.tree = new RBush<RectNode>();
    }

    clear():void{
        this.tree.clear();
        this.nodeMap.clear();
        this.lineMap.clear();
        this.linkMap.clear();
    }

    setData(data:GMLData):void{
        this.clear();
        this.linkMap=data.linkMap;
        this.lineMap=data.lineMap;
        this.nodeMap=data.nodeMap;
        this.addToRTree();
    }

    private addToRTree() {
        for (const [_id, node] of this.nodeMap) {
            this.tree.insert(node.getTreeNode());
        }
        for (const [_id, node] of this.lineMap) {
            this.tree.insert(node.getTreeNode());
        }
    }

}