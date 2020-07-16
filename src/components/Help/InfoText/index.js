import React from 'react';
import './InfoText.css';

const InfoText = ({messages = [], type}) => {

  const renderErrorRow = (type, messages) => {
    return (
      <>
        <span className="info-help-title">{`${type} Messages`}</span>
        <div className="infoErrors">
          {messages.map((s, idx) => <span key={idx} data-testid={`${type}-message`}>{s}</span>)}
        </div>
      </>
    )
  }

  const normalErrors = (messages) => {

    return (
      <div data-testid="info-text-component" className="info-message">
        {messages.map((s, idx) => {

          for (let key in s) {

            return renderErrorRow(key, s[key])
          }
        })}
      </div>
    );
  }

  const serverErrors = (messages) => (
    <div data-testid="info-text-component" className="info-message">
      <span className="info-help-title">Server Error Messages</span>
      <div className="infoErrors">
        {messages.map((s, idx) => <span key={idx} data-testid={`${type}-message`}>{s.error}</span>)}
      </div>
    </div>
  )

  const renderErrors = (messages = []) => {
    ;
    if (messages[0]?.type === 'server') {
      return serverErrors(messages)
    }
    return normalErrors(messages)
  }

  return renderErrors(messages)
}

export default InfoText;
