import React from 'react';
import Button from "../Button/Button";
import './flowContainer.css';
import { Context as FlowContext } from "../../context/FlowContext";
import Input from "./Input";
import Update from "./Update";
import RunArrow from "./RunArrow";
import RunButton from "./RunButton";
import ResultsButton from "./ResultsButton";



const FlowContainer = () => {
  const {state } = React.useContext(FlowContext);
  const Flow = () => (
    <div data-testid="component-flow" className="flowContainer">
      <Input/>
      <Update/>
      <RunButton/>
      <RunArrow/>
      <ResultsButton/>
    </div>
  )

  return (
    <>
      {state.enabled ? Flow() : null}
    </>
  )
}


export default FlowContainer;
