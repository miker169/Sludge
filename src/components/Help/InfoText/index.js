import React from 'react';
import './InfoText.css';

const InfoText = ({messages = [], type}) => {

if(!!messages[0]["run_errors"]){
  messages = messages[0]["run_errors"]
}


  return (
      <div data-testid="info-text-component" className="info-message">
        <span className="info-help-title">{`${type} Messages`}</span>
        <div className="infoErrors">
          {messages.map((s, idx) => <span key={idx} data-testid={`${type}-message`}>{s}</span>)}
        </div>
      </div>
    )
}

export default InfoText;
