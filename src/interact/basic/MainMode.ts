import {AbsSubMode} from "@/interact/basic/SubMode";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent";
import {EventContext} from "@/plugins";

export abstract class AbsMainMode {

    currentSubMode:AbsSubMode;
    subModes:AbsSubMode[]=[];

    protected constructor(subModes:AbsSubMode[]) {
        this.subModes=subModes;
        this.currentSubMode=subModes[subModes.length-1];
    }

    abstract canBeEnable(event:InteractiveEvent,ctx:EventContext):boolean;

    abstract canBeExit(event:InteractiveEvent,ctx:EventContext):boolean;

    /** 当前模式执行之后判断要不要退出该模式 */
    work(event:InteractiveEvent,ctx:EventContext):void{
        this.detect(event,ctx);
        this.currentSubMode.work(event, ctx);
    }

    detect(event:InteractiveEvent,ctx:EventContext):void{
        /** 当前子模式不能退出，仍在当前子模式下执行事件 */
        if(!this.currentSubMode.canBeExit(event, ctx)){
            return;
        }
        /** 当前子模式能退出，重新寻找能够执行的子模式 */
        for(const submode of this.subModes){
            if(submode.canBeEnable(event,ctx)){
                this.currentSubMode=submode;
                return;
            }
        }
    }

}