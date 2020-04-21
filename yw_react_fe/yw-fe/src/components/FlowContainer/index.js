import React from 'react';
import Button from "../Button/Button";
import Arrow from "../arrow";
import './flowContainer.css';

const FlowContainer = () => {
  return (
    <div data-testid="component-flow" className="flowContainer">
    <div className="inputFlow">
      <Button classes={['flow']} title="Input Static Data" />
    </div>
    <div className="updateFlow">
      <Arrow>
        <path className="arrow pull-down" markerEnd="url(#arrowhead)" d="M115 225 Q 19 32 180 39" strokeWidth="3" stroke="white" fill="transparent"/>
      </Arrow>
      <Button classes={['flow']} title="Update Static Data" />
    </div>
    <div className="runFlow">
      <Button classes={['flow']} title="Run Model" />
    </div>
    <div className="next">
      <Arrow />
    </div>
    <div className="resultsFlow">
      <Button classes={['flow']} title="Get Results" />
    </div>
  </div>
  )
}


export default FlowContainer;
