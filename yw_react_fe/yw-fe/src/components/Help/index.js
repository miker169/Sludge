import React from 'react';
import './help.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { Context as FlowContext } from "../../context/FlowContext";

const Help = () => {
 const {state} = React.useContext(FlowContext);
  return (
    <>
    {(!state.inputDisabled || !state.runDisabled)
      ? <div>
        <span data-testid="component-help" className="step1"><FontAwesomeIcon className="help-icon" icon={faInfoCircle} />
        {state.helpText} <div className="fileList">
            {state.files.map((x, idx) => <span key={idx}>{x.name}</span>)}
          </div>
        </span>
      </div>
    : (!state.getResultsDisabled && !!state.messages)
        ?  <div>
        <span data-testid="component-help" className="step1"><FontAwesomeIcon className="help-icon" icon={faInfoCircle} />
          <div className="messageInfo">
            <span>Load Message:</span>  {state.messages.Load_message}
          </div>
           <div className="messageInfo">
            <span>Distance Message:</span> <div>{state.messages.Distance_message.split('\n').map(s => <span>{s}</span>)}</div>
          </div>
        </span>
        </div>
        : <span data-testid="component-help" className="step1"><FontAwesomeIcon className="help-icon" icon={faInfoCircle} />{state.helpText}</span>}
    </>

  )
}

export default Help;
