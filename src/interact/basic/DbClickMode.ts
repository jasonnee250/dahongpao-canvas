import {AbsSubMode} from "@/interact/basic/SubMode";
import {InteractiveEvent, InteractiveEventType} from "@/interact/basic/InteractiveEvent";
import {EventContext} from "@/plugins";
import {IProcessor} from "src/interact/basic/IProcessor";
import {GraphicUtils} from "dahongpao-core";

export abstract class DbClickMode extends AbsSubMode{
    private deltaDistance = 1;
    locked: boolean = false;

    private firstPointerDown:boolean=false;

    constructor(processors:IProcessor[]) {
        super(processors);
    }

    canBeEnable(event: InteractiveEvent, _ctx: EventContext): boolean {
        if(event.type===InteractiveEventType.pointerDown){
            if(!this.firstPointerDown){
                //第一次down
                this.firstPointerDown=true;
                setTimeout(()=>{
                    this.firstPointerDown=false;
                },300);
                return false;
            }else{
                //有第一次down，且间隔300ms内，判断为true
                this.locked=true;
                return true;
            }
        }
        return false;
    }

    work(event: InteractiveEvent, ctx: EventContext) {
        //db click退出逻辑
        if(this.firstPointerDown && event.type===InteractiveEventType.pointerup){
            this.locked=false;
        }
        //pointer move距离过大导致的退出
        if(event.type===InteractiveEventType.pointermove){
            const distance=GraphicUtils.distance(ctx.lastInteractiveEvent?.globalPoint, event.globalPoint);
            if(distance>this.deltaDistance/ctx.gmlRender.getScale()){
                this.locked=false;
            }
        }
        if(!this.firstPointerDown){
            this.locked=false;
        }

        super.work(event, ctx);
    }

    canBeExit(event: InteractiveEvent, ctx: EventContext): boolean {
        //db click退出逻辑
        const res= !this.locked;
        if(res){
            this.stop(event, ctx);
        }
        return res;
    }

}