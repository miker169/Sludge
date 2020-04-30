import React from 'react';
import FileInput from "../FileUpload/fileInput";
import FlowContainer from "../FlowContainer";
import './main.css';
import { Context as FlowContext } from "../../context/FlowContext";
import Help from "../Help";
import ScenarioModelling from "../scenarioModelling";
import RefreshButton from "../refreshButton";

const Main = () => {
  const {state} = React.useContext(FlowContext);

  return (
    <div data-testid="component-main" className="mainContainer">
      <div className="csv-choose">
        {state.fileInputDisabled ? null : <FileInput/> }
        <Help />
        <RefreshButton/>
      </div>
      <FlowContainer/>
      <hr className="spacer"/>
      <ScenarioModelling />
    </div>
  )
}

export default Main;
