/* istanbul ignore file */
import React from 'react';
import Select from 'react-select'
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import './App.css';
// import * as modelConstants from './model_constants'

export const options = [
    { value: '', label: '' },
    { value: 'Polymer 1 Cost', label: 'Polymer 1 Cost' },
    { value: 'Polymer 2 Cost', label: 'Polymer 2 Cost' },
    { value: 'KWH Cost', label: 'KWH Cost' },
    { value: 'KWH Value', label: 'KWH Value' },
    { value: 'Fuel Cost', label: 'Fuel Cost' },
    { value: 'Sludge Production Modifier', label: 'Sludge Production Modifier' },
    { value: 'Sludge Throughput Modifier', label: 'Sludge Throughput Modifier' }
  ]


export const param_selector = (

  <div className = "param-container">



      {/*<div className = "param-model-container">*/}

      {/*{modelConstants.model_flow}*/}

      {/*</div>*/}

    </div>
      )