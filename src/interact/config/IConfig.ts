import {DetectorEnum, AbsDetector} from "@/interact/detector/AbsDetector.ts";
import {AbsMainMode} from "@/interact/basic/MainMode.ts";

export interface IConfig{
    detectors:Map<DetectorEnum,AbsDetector<any>>;

    modes:AbsMainMode[];
}