import React from 'react';
import './refreshButton.css';
import { Context as FlowContext} from '../../context/FlowContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from  '@fortawesome/free-solid-svg-icons'

const RefreshButton = () => {
  const { refresh } = React.useContext(FlowContext);

  return(
    <div className="refresh" data-testid="refresh-btn">
      <a data-testid="refreshClickHandler" onClick={() =>  refresh()}>
        <FontAwesomeIcon size={"2x"} icon={faRedo} />
      </a>
    </div>
  )
}

export default RefreshButton;
