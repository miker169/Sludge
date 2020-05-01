import React from 'react';
import './InfoText.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

const InfoText = ({messages = {Load_message: '',Distance_message: '' }}) => {
  return (
    <div data-testid="info-text-component">
      <span data-testid="component-warnings" className="info-help">
        <FontAwesomeIcon className="info-help-icon" icon={faInfoCircle}/>
        {messages.Load_message ? <div className="info-message">
          <span className="info-help-title">Load Messages:</span>
          <div className="infoErrors">
            {messages.Load_message.split('\n').map(s => <span data-testid="load-message">{s}</span>)}
          </div>
        </div> : null
        }
        {!!messages.Distance_message ? <div className="info-message">
          <span className="help-title">Distance Messages:</span>
          <div className="info-Errors">
            {messages.Distance_message.split('\n').map(s => <span data-testid="distance-message">{s}</span>)}
          </div>
        </div> : null
        }
      </span>
    </div>
  )
}

export default InfoText;
