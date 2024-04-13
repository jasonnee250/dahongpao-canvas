import {IProcessor} from "@/interact/basic/IProcessor";
import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector.ts";

export interface IConfig{
    detectors:Map<DetectorEnum,AbsDetector<any>>;
    processors:IProcessor[];
}