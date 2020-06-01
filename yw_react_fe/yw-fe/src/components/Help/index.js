import React from 'react';
import './help.css';
import FlowHelp from "./FlowHelp";
import Info from "./Info";
import UploadedFiles from "./UploadedFiles";
import { HelpContext } from "../../context/HelpContext";

const Help = ({messages, files }) => {
 const { helpText, errorText } = React.useContext(HelpContext);
  return (
    <div data-testid="component-help">
      {(!messages && errorText.length === 0 )
        ? <UploadedFiles helpText={helpText} files={files} />
        : (messages || errorText.length > 0 )
          ? <Info messages={messages} errorText={errorText}/>
          : <FlowHelp helpText={helpText} files={files} />
      }
    </div>
  )
}

export default Help;
