import React from 'react';
import logo from './images/yw-logo-blue.png';
import * as modelConstants from './model_constants'
import * as paramConstants from './param_constants'
import './App.css';
import {Tab} from 'react-bootstrap';
import {Tabs} from 'react-bootstrap';
import Nav from "./components/nav/Nav";
import Button from "./components/Button/Button";
import arrow_1 from "./yw-arrow-1.svg";
import arrow_2 from "./yw-arrow-2.svg";
import Header from "./components/Header/header";
// import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <>
      <Header />
      <Nav/>
      <div className="mainContainer">
        <div className="fileUpload">
          <label className="file">
            <input type="file" className="custom-file-input"/>
            <span className="file-custom"></span>
          </label>
        </div>
        <div className="flowContainer">
          <div className="inputFlow">
            <Button classes={['flow']} title="Input Static Data" />
          </div>
          <div className="updateFlow">
            <img src={arrow_1} alt="arrow_1"  className="arrow"/>
            <Button classes={['flow']} title="Update Static Data" />
          </div>
          <div className="runFlow">
            <Button classes={['flow']} title="Run Model" />
          </div>
          <div className="next">
            <img src={arrow_2} alt="arrow_1"  className="arrow"/>
          </div>
          <div className="resultsFlow">
            <Button classes={['flow']} title="Get Results" />
          </div>
        </div>
      </div>
    </>
    // <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
    //   <Tab eventKey="profile" title="Standard Modelling">
    // <div>
    // <div>
    // <div>
    //     <img src={logo} alt="logo" width="400" height="200"/>
    //     <h1>Sludge Modelling Tool</h1>
    //     {/*<h1 class = "page-title">Sludge Modelling Tool</h1>*/}
    // </div>
    //
    // {modelConstants.model_flow}
    //
    // </div>
    // </Tab>
    // <Tab eventKey="contact" title="Scenario Modelling">
    // <div>
    //     <img src={logo} alt="logo" width="400" height="200"/>
    //     <h1 className = "page-title">Sludge Modelling Tool</h1>
    //     <h3 className = "param-title">Parameter Selection</h3>
    // </div>
    //
    // {paramConstants.param_selector}
    //
    // </Tab>
    // </Tabs>


);
}

export default App;
