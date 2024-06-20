import {IApplication, IPlugin} from "dahongpao-core";

export class WindowResizePlugin implements IPlugin{
    app: IApplication;

    constructor(app: IApplication) {
        this.app = app;
    }
    start(): void {
        window.addEventListener("resize",this.onResize);
    }
    stop(): void {
        window.removeEventListener("resize",this.onResize);
    }

    onResize=()=>{
        this.app.redrawWithinViewBounds();
    }

}