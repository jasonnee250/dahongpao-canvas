import {IProcessor} from "@/interact/basic/IProcessor";
import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector.ts";
import {AbsMainMode} from "@/interact/basic/MainMode.ts";

export interface IConfig{
    detectors:Map<DetectorEnum,AbsDetector<any>>;
    processors:IProcessor[];

    modes:AbsMainMode[];
}