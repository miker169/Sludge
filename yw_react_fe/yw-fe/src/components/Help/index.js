import React from 'react';
import './help.css';
import { Context as FlowContext } from "../../context/FlowContext";
import { Context as FileContext } from "../../context/FileContext";
import FlowHelp from "./FlowHelp";
import Info from "./Info";
import UploadedFiles from "./UploadedFiles";

const Help = () => {
 const {state} = React.useContext(FlowContext);
 const {state: fileState } = React.useContext(FileContext)
  return (
    <div data-testid="component-help">
      {((!state.inputDisabled || !state.runDisabled) && !state.messages)
        ? <UploadedFiles helpText={state.helpText} files={fileState.files} />
        : (state.messages )
          ? <Info messages={state.messages}/>
          : <FlowHelp helpText={state.helpText} fileNames={fileState.validFileNames} files={fileState.files} />
      }
    </div>
  )
}

export default Help;
