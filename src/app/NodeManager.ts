import {AbsNodeManager, GMLData, GraphicNode, GraphLinkLine, IGraphicLine, RectNode} from "dahongpao-core";
import RBush from "rbush";

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

    searchNodes(minX:number,minY:number,maxX:number=minX,maxY:number=minY):GraphicNode[]{
        const rect: RectNode = {
            id: "pointer",
            minX,
            minY,
            maxX,
            maxY,
        }
        const res = this.tree.search(rect);
        const nodeList: GraphicNode[] = [];
        for (const treeNode of res) {
            const node = this.nodeMap.get(treeNode.id);
            if (node) {
                nodeList.push(node);
            }
        }
        nodeList.sort((a, b) => a.zIndex - b.zIndex);
        return nodeList;
    }

    addNode(node:GraphicNode){
        this.nodeMap.set(node.id,node);
        this.addIndexNode(node.getRectNode());
    }

    addLine(node:IGraphicLine){
        this.lineMap.set(node.id,node);
        this.addIndexNode(node.getRectNode());
    }

    removeNode(node:GraphicNode){
        this.nodeMap.delete(node.id);
        this.removeIndexNode(node.getRectNode());
    }

    removeIndexNode(node:RectNode){
        this.tree.remove(node, (a: RectNode, b: RectNode) => {
            return a.id === b.id;
        })
    }

    addIndexNode(node:RectNode):void{
        this.tree.insert(node);
    }


    relatedLinkLine(node: GraphicNode): Set<string> {
        const relatedLinks:Set<string>=new Set<string>();
        //更新与之相关的linkLine
        for (const [_, link] of this.linkMap) {
            if (link.start === node.id) {
                relatedLinks.add(link.id);
            }
            if (link.end === node.id) {
                relatedLinks.add(link.id);
            }
        }
        return relatedLinks;
    }

    private addToRTree() {
        for (const [_id, node] of this.nodeMap) {
            this.tree.insert(node.getRectNode());
        }
        for (const [_id, node] of this.lineMap) {
            this.tree.insert(node.getRectNode());
        }
    }

}