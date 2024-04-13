import {NodeManager} from "@/app/NodeManager.ts";
import {GMLRender} from "dahongpao-core";
import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector.ts";

export interface EventContext {
    nodeManager:NodeManager;
    gmlRender: GMLRender;
    detectors:Map<DetectorEnum,AbsDetector<any>>;
}