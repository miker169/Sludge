import React from 'react';
import './help.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { Context as FlowContext } from "../../context/FlowContext";

const Help = () => {
 const {state} = React.useContext(FlowContext);
  return (
    <span data-testid="component-help" className="step1"><FontAwesomeIcon className="help-icon" icon={faInfoCircle} />{state.helpText}</span>
  )
}

export default Help;
