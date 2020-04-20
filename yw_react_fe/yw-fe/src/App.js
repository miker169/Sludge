import React from 'react';
import logo from './Yorkshire-Water-logo.jpg';
import * as modelConstants from './model_constants'
import * as paramConstants from './param_constants'
import './App.css';
import {Tab} from 'react-bootstrap';
import {Tabs} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
      <Tab eventKey="profile" title="Standard Modelling">
    <div>
    <div>
        <img src={logo} alt="logo" width="400" height="200"/>
        <h1 class = "page-title">Sludge Modelling Tool</h1>
    </div>

    {modelConstants.model_flow}
    
    </div>
    </Tab>
    <Tab eventKey="contact" title="Scenario Modelling">
    <div>
        <img src={logo} alt="logo" width="400" height="200"/>
        <h1 class = "page-title">Sludge Modelling Tool</h1>
        <h3 class = "param-title">Parameter Selection</h3>
    </div>

    {paramConstants.param_selector}

    </Tab>
    </Tabs>


);
}

export default App;
