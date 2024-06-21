import {EventContext} from "@/plugins/EventContext";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent.ts";

export enum DetectorEnum {
    Node,
    Stretch,
}
export abstract class AbsDetector<T> {

    result:T|null=null;
    detect(event: InteractiveEvent, ctx: EventContext):boolean{
        if(this.result){
            return true;
        }
        return this._onDetect(event,ctx);
    }
    reset():void{
        this.result=null;
    }

    /**
     * 外部不要直接调用这个方法
     * @param event
     * @param ctx
     */
    abstract _onDetect(event: InteractiveEvent, ctx: EventContext):boolean;
}