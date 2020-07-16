import React from 'react';
import Button from "../../Button/Button";
import './ResultsButton.css';
import {FlowContext} from "../../../context/FlowContext";

const ResultsButton = React.memo(() => {
  const { state } = React.useContext(FlowContext)
  let downloadFileName = state.downloadFileName;

  if(state?.downloadFileName?.length === 0){
    downloadFileName = 'YWBM_outputs_' + Date.now().toString().split("T")[0];
  }
  return (
    <div className="resultsFlow" data-testid="results-component">
      <Button download={downloadFileName} url={state.fileDownloadUrl} name="results" disabled={state.getResultsDisabled} classes={['flow']} title="Get Results" />
    </div>
  )
})

export default ResultsButton;
