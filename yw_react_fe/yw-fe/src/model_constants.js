import React from 'react';
import arrow_1 from './yw-arrow-1.svg';
import arrow_2 from './yw-arrow-2.svg';
import './App.css';
import {Button} from 'react-bootstrap';
import {DropdownButton} from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap';


export const model_flow = (

<div>

<div className = "top-container">
    <input type="file" id="files" name="file" onClick={() => {
      "displayProcess(0)"
    }}/>

        <DropdownButton id="dropdown-basic-button" title="Output Type">
          <Dropdown.Item href="#/csv">CSV</Dropdown.Item>
          <Dropdown.Item href="#/pdf">PDF</Dropdown.Item>
        </DropdownButton>
    </div>

    <style type="text/css">
    {`.btn-xxl {
      font-size: 2rem;
      height: 60%;
      width: 25%;

    }
    `}
  </style>

    <div className= "central-container">
        <Button variant="outline-primary" size="xxl">
          Input Static Data
        </Button>

        <img src={arrow_1} alt="arrow_1" width="300" height="100" className="arrow"/>

        <Button variant="outline-primary" size="xxl">
          Run Model
        </Button>

        <img src={arrow_2} alt="arrow_2" width="260" height="100" className= "arrow-2"/>

        <Button variant="outline-primary" size="xxl">
          Get Results
        </Button>
    </div>

    <div className= "lower-container">
          <Button variant="outline-primary" size="xxl">
          Update Static Data
          </Button>
    </div>
    </div>

)
