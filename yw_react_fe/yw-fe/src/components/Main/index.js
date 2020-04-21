import React from 'react';
import FileInput from "../FileUpload/fileInput";
import FlowContainer from "../FlowContainer";
import './main.css';

const Main = () => {
  return (
    <div data-testid="component-main" className="mainContainer">
      <FileInput />
      <FlowContainer />
    </div>
  )
}

export default Main;
