import React from 'react';
import Button from "../../Button/Button";
import './ResultsButton.css';

const ResultsButton = ({fileDownloadUrl, disabled}) => {
  return (
    <div className="resultsFlow" data-testid="results-component">
      <Button download="results.csv" url={fileDownloadUrl} name="results" disabled={disabled} classes={['flow']} title="Get Results" />
    </div>
  )
}

export default ResultsButton;
