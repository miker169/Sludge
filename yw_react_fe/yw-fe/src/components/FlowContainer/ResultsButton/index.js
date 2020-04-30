import React from 'react';
import { Context as FlowContext} from "../../../context/FlowContext";
import Button from "../../Button/Button";
import './ResultsButton.css';

const ResultsButton = () => {
  const {state} = React.useContext(FlowContext);
  return (
    <div className="resultsFlow" data-testid="results-component">
      <Button download="results.csv" url={state.fileDownloadUrl} name="results" disabled={state.getResultsDisabled} classes={['flow']} title="Get Results" />
    </div>
  )
}

export default ResultsButton;
