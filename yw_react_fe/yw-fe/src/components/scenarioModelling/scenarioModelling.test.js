import React from 'react';
import { render } from '@testing-library/react';
import ScenarioModelling from "./index";
import userEvent from "@testing-library/user-event";
import { Provider as ScenarioProvider } from '../../context/ScenarioContext'

describe('<ScenarioModelling/>', () => {
  const wrapper = (props) => {
    return render(
      <ScenarioProvider>
        <ScenarioModelling {...props}/>
      </ScenarioProvider>
        )
  }
  test('it renders without error', () => {
    const { queryByTestId } = wrapper();
    const scenarioTool = queryByTestId('scenario-component');
    expect(scenarioTool).toBeInTheDocument();
  });

  test('It has a header', () => {
    const { queryByTestId} = wrapper();
    const header = queryByTestId('scenario-header-component');
    expect(header).toBeInTheDocument();
  });

  test('It has a drop down select container', () => {
    const { queryByTestId} = wrapper();
    const dropdown = queryByTestId('scenario-dropdown-component');
    expect(dropdown.tagName.toLowerCase()).toBe('ul');
  });

});
