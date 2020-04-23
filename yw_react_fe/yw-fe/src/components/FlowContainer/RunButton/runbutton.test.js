import React from 'react';
import { render } from "@testing-library/react";
import { Provider as FlowProvider } from "../../../context/FlowContext";
import RunButton from "./index";
import userEvent from "@testing-library/user-event";

describe('<RunButton', () => {
  const wrapper = () => {
    return render(<FlowProvider><RunButton/></FlowProvider>);
  }

  test('it renders without error', () => {
    let {queryByTestId} = wrapper();
    let runComponent = queryByTestId('run-component');
    expect(runComponent).toBeInTheDocument();
  });

  describe('when disabled', () => {
    let runDataMock = jest.fn();
    beforeEach(()=> {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: {runDisabled: true},
          uploadData: runDataMock
        }
      })
    });
    test('Has the disabled class', () => {
      const {queryByTestId} = wrapper();
      const inputBtn = queryByTestId('run-component-btn');
      expect(inputBtn).toHaveClass('disabled');
    });

    test('Cannot call run data', () => {
      const {queryByTestId} = wrapper();
      const inputBtn = queryByTestId('run-component-btn');
      userEvent.click(inputBtn);
      expect(runDataMock).not.toHaveBeenCalled();
    });
  })

  describe('when enabled', () => {
    let runDataMock = jest.fn();
    beforeEach(()=> {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: {runDisabled: false},
          runData: runDataMock
        }
      })
    });
    test('Does not have the disabled class', () => {
      const {queryByTestId} = wrapper();
      const inputBtn = queryByTestId('run-component-btn');
      expect(inputBtn).not.toHaveClass('disabled');
    });

    test('Can call run data', () => {
      const {queryByTestId} = wrapper();
      const inputBtn = queryByTestId('run-component-btn');
      userEvent.click(inputBtn);
      expect(runDataMock).toHaveBeenCalled();
    });
  })


});
