import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector";
import {AbsMainMode} from "@/interact/basic/MainMode";

export interface IConfig{
    detectors:Map<DetectorEnum,AbsDetector<any>>;

    modes:AbsMainMode[];
}