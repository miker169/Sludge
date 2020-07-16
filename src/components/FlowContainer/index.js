import React from 'react';
import './flowContainer.css';
import Input from './Input';
import Update from './Update';
import RunArrow from './RunArrow';
import RunButton from './RunButton';
import ResultsButton from './ResultsButton';
import {FlowContext} from "../../context/FlowContext";

const FlowContainer = React.forwardRef(({ enabled, saveMessages }, ref) => {
  const { resetFlow, state } = React.useContext(FlowContext)


  React.useImperativeHandle(ref, () => ({
    reset: () => resetFlow()
  }));

  const Flow = state =>
    <div>
      <div data-testid="component-flow" className="flowContainer">
        <Input
          saveMessages={saveMessages}
        />
        <Update />
        <RunButton />
        <RunArrow />
        <ResultsButton />
      </div>
    </div>;

  return (
    <React.Fragment>
      {enabled ? Flow(state) : null}
    </React.Fragment>
  );
});

export default FlowContainer;
