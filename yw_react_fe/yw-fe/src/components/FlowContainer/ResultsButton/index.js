import React from 'react';
import Button from "../../Button/Button";
import './ResultsButton.css';

const ResultsButton = React.memo(({fileDownloadUrl, disabled, downloadFileName = ''}) => {
  if(downloadFileName.length === 0){
    downloadFileName = 'YWBM_outputs_' + Date.now().toString().split("T")[0];
  }
  return (
    <div className="resultsFlow" data-testid="results-component">
      <Button download={downloadFileName} url={fileDownloadUrl} name="results" disabled={disabled} classes={['flow']} title="Get Results" />
    </div>
  )
})

export default ResultsButton;
