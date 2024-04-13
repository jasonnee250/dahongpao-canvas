import {IConfig} from "@/interact/config/IConfig";
import {DragProcessor} from "@/interact/drag/DragProcessor";
import {DetectorEnum} from "@/interact/detector/AbsDetector.ts";
import {NodeDetector} from "@/interact/detector/NodeDetector";

export class NormalConfig implements IConfig {
    detectors = new Map([
        [DetectorEnum.Node, new NodeDetector()],
    ]);
    processors = [
        new DragProcessor(),
    ]

}