import React from 'react';
import './scenarioModelling.css';
import List from "../List";
import Form from "../Form";
import scenario from "../../context/scenario";
import {buildInputOption} from "../../lib/inputOptionBuilder";

const ScenarioModelling = () => {
  const [inputOptions, setInputOptions] = React.useState([{...scenario, row: 1}])

  return (

    <div data-testid="scenario-component" className="scenario">
      <header data-testid="scenario-header-component">Scenario Modelling</header>
      <div className="scenario-row">
        {inputOptions.length > 0 && inputOptions.map((option,idx) =>
          !!option.items
            ? <List key={idx} idx={idx.toString()} next={buildInputOption(setInputOptions, inputOptions)} options={option.items}/>
            : <Form fields={option.Fields}/>
        )}
      </div>
  </div>)
}

export default ScenarioModelling;
