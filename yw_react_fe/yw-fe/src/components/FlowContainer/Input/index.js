import React from 'react';
import Button from "../../Button/Button";
import {Context as FlowContext } from "../../../context/FlowContext";
import './input.css'

const Input = () => {
  const {state, uploadData } = React.useContext(FlowContext);
  return (
  <div className="inputFlow" data-testid="input-static">
    <Button
      clickHandler={state.inputDisabled ? (evt) => evt.preventDefault() : () => uploadData(state.files)}
      disabled={state.inputDisabled}
      name="input"
      classes={['flow']}
      title="Input Static Data"
    />
  </div>
  )
}

export default Input;
