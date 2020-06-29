import React from 'react';
import Button from "../../Button/Button";
import './runbutton.css';
import { runModel } from "../../../helpers/runModel";
import { HelpContext} from "../../../context/HelpContext";

const RunButton = ({downloadFileName, runDisabled, saveMessages, modelRan, beginRunData, params, setDownloadFileName, paramErrors}) => {

  const { setHelpText } = React.useContext(HelpContext);

  return (
    <div className="runFlow" data-testid="run-component">
      <Button
        clickHandler={() => {
          beginRunData();
          runModel(saveMessages, modelRan, setHelpText, params, setDownloadFileName, paramErrors, downloadFileName)
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