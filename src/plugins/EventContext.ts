import {NodeManager} from "@/app/NodeManager.ts";
import {GMLRender} from "dahongpao-core";
import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector.ts";
import {InteractiveEvent} from "@/interact";

export interface EventContext {
    nodeManager:NodeManager;
    gmlRender: GMLRender;
    detectors:Map<DetectorEnum,AbsDetector<any>>;
    lastInteractiveEvent:InteractiveEvent|null;
    lastDiffTypeEvent:InteractiveEvent|null;

    reset():void;
}