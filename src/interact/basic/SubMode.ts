import {IProcessor} from "@/interact/basic/IProcessor";
import {InteractiveEvent} from "@/interact/basic/InteractiveEvent";
import {EventContext} from "@/plugins";

export abstract class AbsSubMode {

    processors:IProcessor[]=[];

    constructor(processors:IProcessor[]) {
        this.processors=processors;
    }

    abstract canBeEnable(event:InteractiveEvent,ctx:EventContext):boolean;

    abstract canBeExit(event:InteractiveEvent,ctx:EventContext):boolean;

    work(event:InteractiveEvent,ctx:EventContext):void{
        for(const processor of this.processors){
            if(processor.allowEventTypeSet.has(event.type)){
                processor.process(event,ctx);
            }
        }
    }
}
