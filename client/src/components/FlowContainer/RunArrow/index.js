import React from 'react';
import Arrow from "../../arrow";
import './arrow.css';


const RunArrow = ({disabled, nextArrowRan}) => {

  return (
    <div className="next" data-testid="next-arrow-component">
      <Arrow name="run" disabled={disabled} ran={nextArrowRan} />
    </div>
  )
}

export default RunArrow;
