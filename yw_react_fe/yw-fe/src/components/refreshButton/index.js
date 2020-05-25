import React from 'react';
import './refreshButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from  '@fortawesome/free-solid-svg-icons'

const RefreshButton = ({ onClickHandler}) => {

  return(
    <div className="refresh" data-testid="refresh-btn">
      <a data-testid="refreshClickHandler"
         href="/#"
         onClick={() => onClickHandler()}>
        <FontAwesomeIcon size={"2x"} icon={faRedo} />
      </a>
    </div>
  )
}

export default RefreshButton;
