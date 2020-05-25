import React from 'react';
import { render } from "@testing-library/react";
import { HelpContextProvider } from "../../../context/HelpContext";
import RunButton from "./index";
import userEvent from "@testing-library/user-event";
import { runModel } from "../../../helpers/runModel";
jest.mock('../../../helpers/runModel');

describe('<RunButton', () => {
  const wrapper = (props) => {
    return render(<HelpContextProvider><RunButton {...props} /></HelpContextProvider>);
  }

  test('it renders without error', () => {
    let {queryByTestId} = wrapper();
    let runComponent = queryByTestId('run-component');
    expect(runComponent).toBeInTheDocument();
  });

  describe('when disabled', () => {
    let setHelpTextMock = jest.fn();
    let queryByTestId;
    beforeEach(()=> {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          setHelpText: setHelpTextMock,
        }
      });
      ({queryByTestId} = wrapper({runDisabled: true, beginRunData: jest.fn(), runModel}));
    });
    test('Has the disabled class', () => {
      const inputBtn = queryByTestId('run-component-btn');
      expect(inputBtn).toHaveClass('disabled');
    });

    test('Cannot call run data', () => {
      const inputBtn = queryByTestId('run-component-btn');
      userEvent.click(inputBtn);
      expect(setHelpTextMock).not.toHaveBeenCalled();
    });
  })

  describe('when enabled', () => {
    let queryByTestId;

    beforeEach(() => {
      jest.clearAllMocks();
      runModel.mockImplementation(() => {});
      ({ queryByTestId} = wrapper({runDisabled: false, beginRunData: jest.fn(), runModel}));
    })
    test('Does not have the disabled class', () => {
      const inputBtn = queryByTestId('run-component-btn');
      expect(inputBtn).not.toHaveClass('disabled');
    });

    test('Can call run data', () => {
      const inputBtn = queryByTestId('run-component-btn');
      userEvent.click(inputBtn);
      expect(runModel).toHaveBeenCalled();
    });
  })


});
