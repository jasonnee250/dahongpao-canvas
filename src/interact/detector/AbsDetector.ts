import {EventContext} from "@/plugins/EventContext";

export enum DetectorEnum {
    Node,
}
export abstract class AbsDetector<T> {

    result:T|null=null;
    detect(event: PointerEvent, ctx: EventContext):boolean{
        if(this.result){
            return true;
        }
        return this.onDetect(event,ctx);
    }
    reset():void{
        this.result=null;
    }

    abstract onDetect(event: PointerEvent, ctx: EventContext):boolean;
}