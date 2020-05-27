import React from 'react';
import './help.css';
import FlowHelp from "./FlowHelp";
import Info from "./Info";
import UploadedFiles from "./UploadedFiles";
import { HelpContext } from "../../context/HelpContext";

const Help = ({messages, files }) => {
 const { helpText } = React.useContext(HelpContext);
  return (
    <div data-testid="component-help">
      {(!messages)
        ? <UploadedFiles helpText={helpText} files={files} />
        : (messages )
          ? <Info messages={messages}/>
          : <FlowHelp helpText={helpText} files={files} />
      }
    </div>
  )
}

export default Help;
