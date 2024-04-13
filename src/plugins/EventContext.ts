import {NodeManager} from "@/render/NodeManager";
import {GMLRender} from "dahongpao-core";
import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector.ts";

export interface EventContext {
    nodeManager:NodeManager;
    gmlRender: GMLRender;
    detectors:Map<DetectorEnum,AbsDetector<any>>;
}