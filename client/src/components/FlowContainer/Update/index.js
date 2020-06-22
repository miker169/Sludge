import React from 'react';
import Arrow from "../../arrow";
import './update.css'

const Update = ({inputArrowDisabled, inputArrowRan}) => {

  return (
    <div className="updateFlow" data-testid="update-component">
      <Arrow name="input" disabled={inputArrowDisabled} ran={inputArrowRan} />
    </div>
  )
}

export default Update;
