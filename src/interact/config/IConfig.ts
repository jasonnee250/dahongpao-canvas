import {IProcessor} from "@/interact/processor/IProcessor";
import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector.ts";

export interface IConfig{
    detectors:Map<DetectorEnum,AbsDetector<any>>;
    processors:IProcessor[];
}