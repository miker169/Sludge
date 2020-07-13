import React from 'react';
import './flowContainer.css';
import Input from './Input';
import Update from './Update';
import RunArrow from './RunArrow';
import RunButton from './RunButton';
import ResultsButton from './ResultsButton';
import useFlow from '../../hooks/useFlow';
import ParamsForm from "./ParamsForm";
import {FileContext} from "../../context/FileContext";

const FlowContainer = React.forwardRef(({ enabled, saveMessages }, ref) => {
  const { files } = React.useContext(FileContext)
  const {
    state,
    beginUpload,
    finishUpload,
    beginRunData,
    modelRan,
    setDownloadFileName,
    resetFlow,
    paramErrors
  } = useFlow();

  React.useImperativeHandle(ref, () => ({
    reset: () => resetFlow()
  }));

  const Flow = state =>
    <div>
      <div data-testid="component-flow" className="flowContainer">
        <Input
          disabled={state.inputDisabled}
          payload={files}
          beginUpload={beginUpload}
          finishUpload={finishUpload}
          saveMessages={saveMessages}
        />
        <Update
          inputArrowRan={state.inputArrowRan}
          inputArrowDisabled={state.inputArrowDisabled}
        />
        <RunButton
          beginRunData={beginRunData}
          modelRan={modelRan}
          saveMessages={saveMessages}
          runDisabled={state.runDisabled}
          params={state.params}
          setDownloadFileName={setDownloadFileName}
          paramErrors={paramErrors}
          downloadFileName={state.downloadFileName}
        />
        <RunArrow
          nextArrowRan={state.nextArrowRan}
          disabled={state.nextArrowDisabled}
        />
        <ResultsButton
          disabled={state.getResultsDisabled}
          fileDownloadUrl={state.fileDownloadUrl}
          downloadFileName={state.downloadFileName}
        />
      </div>
    </div>;

  return (
    <React.Fragment>
      {enabled ? Flow(state) : null}
    </React.Fragment>
  );
});

export default FlowContainer;
