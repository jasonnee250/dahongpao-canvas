import {InteractiveEvent} from "src/interact/basic/InteractiveEvent";
import {EventContext} from "src/plugins";

export abstract class ClickHandler{

    abstract enable(event: InteractiveEvent, eventCtx: EventContext):boolean;

    abstract handle(event: InteractiveEvent, eventCtx: EventContext):void;
}