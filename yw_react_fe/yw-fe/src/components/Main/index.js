import React from 'react';
import FileInput from "../FileUpload/fileInput";
import FlowContainer from "../FlowContainer";
import './main.css';
import { Context as FlowContext } from "../../context/FlowContext";
import Help from "../Help";

const Main = () => {
  const {state} = React.useContext(FlowContext);

  return (
    <div data-testid="component-main" className="mainContainer">
      <div className="csv-choose">
        {state.enabled ? null : <FileInput/> }
        <Help />
      </div>
      <FlowContainer/>
    </div>
  )
}

export default Main;
