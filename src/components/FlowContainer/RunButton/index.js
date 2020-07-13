import React from 'react';
import Button from "../../Button/Button";
import './runbutton.css';
import { runModel } from "../../../helpers/runModel";
import { HelpContext} from "../../../context/HelpContext";
import {ParamsContext} from "../../../context/ParamsContext";

const RunButton = ({downloadFileName, runDisabled, saveMessages, modelRan, beginRunData, params, setDownloadFileName, paramErrors}) => {

  const { setHelpText } = React.useContext(HelpContext);
  const {paramsStartDate, paramsList} = React.useContext(ParamsContext)

  return (
    <div className="runFlow" data-testid="run-component">
      <Button
        clickHandler={() => {
          beginRunData();
          runModel(saveMessages, modelRan, setHelpText, params, setDownloadFileName, paramErrors, downloadFileName, paramsStartDate, paramsList)
        }}
        disabled={runDisabled}
        name="run"
        classes={['flow']}
        title="Run Model"
      />
    </div>
  );
}

export default RunButton;
