import React from 'react';
import './refreshButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from  '@fortawesome/free-solid-svg-icons'

const RefreshButton = ({ onClickHandler, flowReset}) => {

  const handleReset = () => {
    onClickHandler();
    flowReset.current.reset();
  }

  return(
    <div className="refresh" data-testid="refresh-btn">
      <a data-testid="refreshClickHandler"
         href="/#"
         onClick={handleReset}>
        <FontAwesomeIcon size={"2x"} icon={faRedo} />
      </a>
    </div>
  )
}

export default RefreshButton;
