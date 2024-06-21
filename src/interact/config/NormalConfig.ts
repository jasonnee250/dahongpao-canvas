import {IConfig} from "@/interact/config/IConfig";
import {DragProcessor} from "@/interact/drag/DragProcessor";
import {DetectorEnum} from "@/interact/detector/AbsDetector.ts";
import {NodeDetector} from "@/interact/detector/NodeDetector";
import {StretchDetector} from "@/interact/detector/StretchDetector.ts";
import {StretchProcessor} from "@/interact/stretch/StretchProcessor.ts";

export class NormalConfig implements IConfig {
    detectors = new Map<DetectorEnum,any>([
        [DetectorEnum.Node, new NodeDetector()],
        [DetectorEnum.Stretch,new StretchDetector()],
    ]);
    processors = [
        new StretchProcessor(),
        new DragProcessor(),
    ]

}