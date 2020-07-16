import React from 'react';
import './InfoText.css';

const InfoText = ({messages = [], type}) => {

if(!!messages[0]["run_errors"]){
  messages = messages[0]["run_errors"]
}

const normalErrors = (messages) =>  (
  <div data-testid="info-text-component" className="info-message">
    <span className="info-help-title">{`${type} Messages`}</span>
    <div className="infoErrors">
      {messages.map((s, idx) => <span key={idx} data-testid={`${type}-message`}>{s}</span>)}
    </div>
  </div>
);

const serverErrors = (messages) =>  (
  <div data-testid="info-text-component" className="info-message">
    <span className="info-help-title">Server Error Messages</span>
    <div className="infoErrors">
      {messages.map((s, idx) => <span key={idx} data-testid={`${type}-message`}>{s.error}</span>)}
    </div>
  </div>

)

  const renderErrors = (messages = []) => {
    if(messages[0]?.type === 'server'){
      return serverErrors(messages)
    }
    return normalErrors(messages)
  }


  return renderErrors(messages)
}

export default InfoText;
