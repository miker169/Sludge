import React from 'react';
import FileInput from "../FileUpload/fileInput";
import FlowContainer from "../FlowContainer";
import './main.css';
import Help from "../Help";
import RefreshButton from "../refreshButton";
import useAppState from "../../hooks/useAppState";
import {HelpContext} from "../../context/HelpContext";
import {FileContext} from "../../context/FileContext";

const Main = () => {

  const { setEnabled, setPayload, setMessages, state, reset  } = useAppState();
  const { errorText } = React.useContext(HelpContext);
  const { files } = React.useContext(FileContext)
  const flowStateRef = React.createRef();

  if( files.length === 2 && state.enabled === false){
    setEnabled(true);
  }

  return (
    <div data-testid="component-main" className="mainContainer">
      <div className="csv-choose">
        {state.enabled ? null : <FileInput  setPayload={setPayload} payload={state.payload} /> }
        <Help enabled={state.enabled}  messages={state.messages} />
        <RefreshButton onClickHandler={reset} flowReset={flowStateRef}/>
      </div>
      <FlowContainer enabled={state.enabled} saveMessages={setMessages} ref={flowStateRef}/>
      <hr className="spacer"/>
    </div>
  )
}

export default Main;
