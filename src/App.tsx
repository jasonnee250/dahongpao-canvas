import React,{useEffect} from 'react'
import {FPSTip} from "@/component/fps/FPSTip";
import {SimpleEditZone} from "@/component/editZone/SimpleEditZone";
import {ButtonGroup, ButtonProp} from "@/component/buttonGroup";
import {DHPCanvas} from "@/component/canvas/DHPCanvas";
import {Application} from "@/app/Application";
import './App.css'
function App() {
  const mainApp=new Application();

  useEffect(() => {
    mainApp.start();
    return ()=>{
      mainApp.stop();
    }

  }, []);

  const parse=()=>{
    const htmlDom=document.getElementsByClassName("edit-zone");
    const editZone=htmlDom[0] as HTMLTextAreaElement;
    mainApp.parse(editZone.value);
  }

  const zoomIn=()=>{
    mainApp.gmlRender.scale(1.1,1.1);
    mainApp.redraw();
  }

  const zoomOut=()=>{
    mainApp.gmlRender.scale(1/1.1,1/1.1);
    mainApp.redraw();
  }

  const reset=()=>{
    mainApp.gmlRender.resetTransform();
    mainApp.redraw();
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
          <DHPCanvas gmlRender={mainApp.gmlRender}/>
        </div>
        <FPSTip/>
      </>

  );
}

export default App
