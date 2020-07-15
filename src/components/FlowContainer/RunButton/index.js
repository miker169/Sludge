import React from 'react';
import Button from "../../Button/Button";
import './runbutton.css';
import { runModel } from "../../../helpers/runModel";
import { HelpContext} from "../../../context/HelpContext";
import {ParamsContext} from "../../../context/ParamsContext";
import {FlowContext} from "../../../context/FlowContext";

const RunButton = ({downloadFileName, runDisabled, saveMessages, modelRan, beginRunData, params, setDownloadFileName, paramErrors}) => {

  const { setHelpText, setErrorText } = React.useContext(HelpContext);
  const {paramsStartDate, paramsList} = React.useContext(ParamsContext)
  const { stopModel} = React.useContext(FlowContext)

  return (
    <div className="runFlow" data-testid="run-component">
      <Button
        clickHandler={() => {
          beginRunData();
          runModel(setErrorText, modelRan, setHelpText, params, setDownloadFileName, paramErrors, downloadFileName, paramsStartDate, paramsList, stopModel)
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
