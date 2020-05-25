import React from 'react';
import FileInput from "../FileUpload/fileInput";
import FlowContainer from "../FlowContainer";
import './main.css';
import Help from "../Help";
import ScenarioModelling from "../scenarioModelling";
import RefreshButton from "../refreshButton";
import useAppState from "../../hooks/useAppState";

const Main = () => {

  const { setEnabled, setPayload, setFiles, setMessages, state, reset  } = useAppState();

  if(state.payload?.productionInput && state.payload?.referenceInput && !state.enabled){
     setEnabled(true);
  }

  return (
    <div data-testid="component-main" className="mainContainer">
      <div className="csv-choose">
        {state.enabled ? null : <FileInput setFiles={setFiles} setPayload={setPayload} payload={state.payload} /> }
        <Help enabled={state.enabled} files={state.files} messages={state.messages} />
        <RefreshButton onClickHandler={reset}/>
      </div>
      <FlowContainer enabled={state.enabled} payload={state.payload} saveMessages={setMessages}/>
      <hr className="spacer"/>
      <ScenarioModelling />
    </div>
  )
}

export default Main;
