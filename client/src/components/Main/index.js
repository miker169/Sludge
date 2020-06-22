import React from 'react';
import FileInput from "../FileUpload/fileInput";
import FlowContainer from "../FlowContainer";
import './main.css';
import Help from "../Help";
import ScenarioModelling from "../scenarioModelling";
import RefreshButton from "../refreshButton";
import useAppState from "../../hooks/useAppState";
import {HelpContext} from "../../context/HelpContext";

const Main = () => {

  const { setEnabled, setPayload, setFiles, setMessages, state, reset  } = useAppState();
  const { errorText } = React.useContext(HelpContext);
  const flowStateRef = React.createRef();

  if( state.files.length === 2 && state.enabled === false){
    setEnabled(true);
  }

  return (
    <div data-testid="component-main" className="mainContainer">
      <div className="csv-choose">
        {state.enabled ? null : <FileInput setFiles={setFiles} files={state.files} setPayload={setPayload} payload={state.payload} /> }
        <Help enabled={state.enabled} files={state.files} messages={state.messages} />
        <RefreshButton onClickHandler={reset} flowReset={flowStateRef}/>
      </div>
      <FlowContainer enabled={state.enabled} payload={state.files} saveMessages={setMessages} ref={flowStateRef}/>
      <hr className="spacer"/>
      <ScenarioModelling />
    </div>
  )
}

export default Main;
