import React from 'react';
import Button from "../Button/Button";
import Arrow from "../arrow";
import './flowContainer.css';
import { Context as FlowContext } from "../../context/FlowContext";



const FlowContainer = () => {
  const {state, uploadData, runData, updateData} = React.useContext(FlowContext);
  debugger;

  const Flow = () => (
    <div data-testid="component-flow" className="flowContainer">
      <div className="inputFlow">
        <Button clickHandler={uploadData} disabled={state.inputDisabled} name="input" classes={['flow']} title="Input Static Data" />
      </div>
      <div className="updateFlow">
        <Arrow name="input" disabled={state.inputArrowDisabled} ran={state.inputArrowRan}>
          <path
            className={state.updateArrowDisabled
              ? "arrow disabled"
              : state.updateArrowRan ? "arrow pull down ran": "arrow pull-down"}
            data-testid="update-component-arrow"
            name="update"
            markerEnd="url(#arrowhead)" d="M145 145 Q 105 42 180 39"
            strokeWidth="3"
            stroke="white"
            fill="transparent"
          />
          <path
            className={state.inputUpdateArrowDisabled
              ? "arrow disabled"
              : state.inputUpdateArrowRan ? "arrow pull-down ran": "arrow pull-down"}
            data-testid="inputupdate-component-arrow"
            name="inputUpdate"
            markerEnd="url(#arrowhead)" d="M5 40 Q 109 33 75 120"
            strokeWidth="3"
            stroke="white"
            fill="transparent"
          />
        </Arrow>
        <Button clickHandler={updateData} disabled={state.updateDisabled} classes={['flow']} title="Update Static Data" name="update" />
      </div>
      <div className="runFlow">
        <Button clickHandler={runData} disabled={state.runDisabled} name="run" classes={['flow']} title="Run Model" />
      </div>
      <div className="next">
        <Arrow name="run" disabled={state.nextArrowDisabled} ran={state.nextArrowRan} />
      </div>
      <div className="resultsFlow">
        <Button name="results" disabled={state.getResultsDisabled} classes={['flow']} title="Get Results" />
      </div>
    </div>
  )

  return (
    <>
      {state.enabled ? Flow() : null}
    </>
  )
}


export default FlowContainer;
