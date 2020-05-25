import React from 'react';
import './flowContainer.css';
import Input from "./Input";
import Update from "./Update";
import RunArrow from "./RunArrow";
import RunButton from "./RunButton";
import ResultsButton from "./ResultsButton";
import useFlow from "../../hooks/useFlow";

const FlowContainer = ({enabled, payload, saveMessages}) => {

const {state, beginUpload, finishUpload,beginRunData, modelRan} = useFlow();
  const Flow = (state) => (
    <div data-testid="component-flow" className="flowContainer">
      <Input disabled={state.inputDisabled} payload={payload} beginUpload={beginUpload} finishUpload={finishUpload}/>
      <Update inputArrowRan={state.inputArrowRan} inputArrowDisabled={state.inputArrowDisabled}/>
      <RunButton beginRunData={beginRunData} modelRan={modelRan} saveMessages={saveMessages} runDisabled={state.runDisabled}/>
      <RunArrow nextArrowRan={state.nextArrowRan} disabled={state.nextArrowDisabled}/>
      <ResultsButton disabled={state.getResultsDisabled} fileDownloadUrl={state.fileDownloadUrl}/>
    </div>
  )

  return (
    <React.Fragment>
      {enabled ? Flow(state) : null}
    </React.Fragment>
  )
}

export default FlowContainer;
