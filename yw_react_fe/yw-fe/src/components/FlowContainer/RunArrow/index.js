import React from 'react';
import {Context as FlowContext } from "../../../context/FlowContext";
import Arrow from "../../arrow";
import './arrow.css';


const RunArrow = () => {
  const {state} = React.useContext(FlowContext);

  return (
    <div className="next" data-testid="next-arrow-component">
      <Arrow name="run" disabled={state.nextArrowDisabled} ran={state.nextArrowRan} />
    </div>
  )
}

export default RunArrow;
