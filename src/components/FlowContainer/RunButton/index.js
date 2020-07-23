import React from 'react';
import Button from "../../Button/Button";
import './runbutton.css';
import { runModel } from "../../../helpers/runModel";
import { HelpContext} from "../../../context/HelpContext";
import {ParamsContext} from "../../../context/ParamsContext";
import {FlowContext} from "../../../context/FlowContext";

const RunButton = () => {

  const { setHelpText, setErrorText } = React.useContext(HelpContext);
  const {paramsList} = React.useContext(ParamsContext)
  const { stopModel, beginRunData, modelRan, state, setDownloadFileName} = React.useContext(FlowContext)
  console.log(paramsList)

  return (
    <div className="runFlow" data-testid="run-component">
      <Button
        clickHandler={() => {
          beginRunData();
          console.log('INside click handler')
          console.log(paramsList)
          runModel(setErrorText, modelRan, setHelpText,setDownloadFileName, paramsList, stopModel)
        }}
        disabled={state.runDisabled}
        name="run"
        classes={['flow']}
        title="Run Model"
      />
    </div>
  );
}

export default RunButton;
