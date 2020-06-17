import React from 'react';
import './scenarioModelling.css';
import List from "../List";
import Form from "../Form";
import useBuildScenarios from "../../hooks/useBuildScenarios";

const ScenarioModelling = () => {
  const [handleScenarioSelection, inputOptions] = useBuildScenarios();

  return (
    <div data-testid="scenario-component" className="scenario">
      <header data-testid="scenario-header-component">Scenario Modelling</header>
      <div className="scenario-row">
        {inputOptions.length > 0 && inputOptions.map((option,idx) =>
          !!option.items
            ? <List key={idx} idx={idx.toString()} handleScenarioSelection={handleScenarioSelection} options={option.items}/>
            : <Form fields={option.Fields}/>
        )}
      </div>
  </div>)
}

export default ScenarioModelling;
