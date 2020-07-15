import React from 'react';
import './refreshButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from  '@fortawesome/free-solid-svg-icons'
import {FileContext} from "../../context/FileContext";
import {ParamsContext} from "../../context/ParamsContext";
import {HelpContext} from "../../context/HelpContext";
import moment from "moment";

const RefreshButton = ({ onClickHandler, flowReset}) => {

  const {resetFiles} = React.useContext(FileContext);
  const {setParamsStartDateHook} = React.useContext(ParamsContext);
  const {setHelpText, setErrorText} = React.useContext(HelpContext)

  const handleReset = () => {
    onClickHandler();
    flowReset.current.reset();
    resetFiles();
    setParamsStartDateHook(moment(new Date()));
    setHelpText('Upload the following files');
    setErrorText([]);

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
