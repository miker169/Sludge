import React from 'react';
import Arrow from "../../arrow";
import './update.css'
import {FlowContext} from "../../../context/FlowContext";

const Update = () => {
  const { state} = React.useContext(FlowContext)

  return (
    <div className="updateFlow" data-testid="update-component">
      <Arrow name="input" disabled={state.inputArrowDisabled} ran={state.inputArrowRan} />
    </div>
  )
}

export default Update;
