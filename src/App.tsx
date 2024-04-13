import {useEffect} from 'react'
import {FPSTip} from "@/component/fps/FPSTip";
import {SimpleEditZone} from "@/component/editZone/SimpleEditZone";
import {ButtonGroup, ButtonProp} from "@/component/buttonGroup";
import {DHPCanvas} from "@/component/canvas/DHPCanvas";
import './App.css'
import {ExampleApp} from "@/example/ExampleApp.ts";
function App() {
  const mainApp=new ExampleApp();

  useEffect(() => {
    mainApp.start();
    return ()=>{
      mainApp.stop();
    }

  }, []);

  const parse=()=>{
    const htmlDom=document.getElementsByClassName("edit-zone");
    const editZone=htmlDom[0] as HTMLTextAreaElement;
    mainApp.application.parse(editZone.value);
  }

  const zoomIn=()=>{
    mainApp.application.gmlRender.scale(1.1,1.1);
    mainApp.application.redraw();
  }

  const zoomOut=()=>{
    mainApp.application.gmlRender.scale(1/1.1,1/1.1);
    mainApp.application.redraw();
  }

  const reset=()=>{
    mainApp.application.gmlRender.resetTransform();
    mainApp.application.redraw();
  }
  const buttons:ButtonProp[]=[];
  buttons.push({click:parse,buttonName:"Draw"});
  buttons.push({click:zoomIn,buttonName:"ZoomIn"});
  buttons.push({click:zoomOut,buttonName:"ZoomOut"});
  buttons.push({click:reset,buttonName:"Reset"});


  return (
      <>
        <div className="container">
          <div className="edit-panel">
            <ButtonGroup buttons={buttons}/>
            <SimpleEditZone/>
          </div>
          <DHPCanvas gmlRender={mainApp.application.gmlRender}/>
        </div>
        <FPSTip/>
      </>

  );
}

export default App
