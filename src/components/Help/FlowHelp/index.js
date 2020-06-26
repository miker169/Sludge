import React from 'react';
import './FlowHelp.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

const FlowHelp = ({helpText} ) => {

  return (
    <div data-testid="flow-help">
      <span
        data-testid="helpText"
        className="flow-help">
        <FontAwesomeIcon
          className="flow-help-icon"
          icon={faInfoCircle}
        />
          {helpText}
        </span>
    </div>
  );
}

export default FlowHelp;
