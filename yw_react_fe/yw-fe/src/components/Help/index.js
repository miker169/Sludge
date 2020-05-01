import React from 'react';
import './help.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { Context as FlowContext } from "../../context/FlowContext";
import FlowHelp from "./FlowHelp";
import InfoText from "./InfoText";
import UploadedFiles from "./UploadedFiles";

const Help = () => {
 const {state} = React.useContext(FlowContext);
  return (
    <div data-testid="component-help">
      {((!state.inputDisabled || !state.runDisabled) && !state.warnings)
        ? <UploadedFiles helpText={state.helpText} files={state.files} />
        : (state.warnings)
          ? <InfoText messages={state.messages}/>
          : <FlowHelp helpText={state.helpText}/>
      }
    </div>
  )
}

export default Help;
