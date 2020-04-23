import React from 'react';
import {Context as FlowContext } from "../../../context/FlowContext";
import Button from "../../Button/Button";
import './runbutton.css';

const RunButton = () => {
  const {state, runData } = React.useContext(FlowContext);

  return (
    <div className="runFlow" data-testid="run-component">
      <Button
        clickHandler={runData}
        disabled={state.runDisabled}
        name="run"
        classes={['flow']}
        title="Run Model"
      />
    </div>
  );
}

export default RunButton;
