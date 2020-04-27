import React from 'react';
import { render} from "@testing-library/react";
import Main from './index';
import { Provider as FlowProvider} from "../../context/FlowContext";
import { Provider as ScenarioProvider} from "../../context/ScenarioContext";
import scenario from "../../context/scenario";

describe('<Main/>',  () => {
  const wrapper = () => {
    return render(<ScenarioProvider><FlowProvider><Main/></FlowProvider></ScenarioProvider>)
  }
  test('it renders without error', () => {
    const {queryByTestId } = wrapper();
    const mainComponent = queryByTestId('component-main');
    expect(mainComponent).toBeInTheDocument();
  });


  describe('When disabled', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: {enabled: false, scenarioOptions: scenario},
          start: jest.fn()
        }
      })
    });

    test('Displays the input field', () => {
      const {queryByTestId } = wrapper();
      const inputComponent = queryByTestId('component-file-upload');
      expect(inputComponent).toBeInTheDocument();
    });

  });

  describe('When enabled', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: {enabled: true , scenarioOptions: scenario},
          start: jest.fn()
        }
      })
    });
    test('Hides the input field', () => {
      const {queryByTestId } = wrapper();
      const inputComponent = queryByTestId('component-file-upload');
      expect(inputComponent).not.toBeInTheDocument();
    });
  });


})
