import React from 'react';
import './help.css';
import { Context as FlowContext } from "../../context/FlowContext";
import FlowHelp from "./FlowHelp";
import Info from "./Info";
import UploadedFiles from "./UploadedFiles";

const Help = () => {
 const {state} = React.useContext(FlowContext);
  return (
    <div data-testid="component-help">
      {((!state.inputDisabled || !state.runDisabled) && !state.messages)
        ? <UploadedFiles helpText={state.helpText} files={state.files} />
        : (state.messages )
          ? <Info messages={state.messages}/>
          : <FlowHelp helpText={state.helpText}/>
      }
    </div>
  )
}

export default Help;
