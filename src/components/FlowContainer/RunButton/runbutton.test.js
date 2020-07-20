import React from 'react';
import { render } from "@testing-library/react";
import { HelpContext } from "../../../context/HelpContext";
import { ParamsContext } from '../../../context/ParamsContext'

import RunButton from "./index";
import userEvent from "@testing-library/user-event";
import { runModel } from "../../../helpers/runModel";
import {FlowContext} from "../../../context/FlowContext";
jest.mock('../../../helpers/runModel');

describe('<RunButton', () => {
  const setHelpText = jest.fn();
  const setErrorText = jest.fn();
  const helpValues = {setHelpText, setErrorText}
  const stopModel = jest.fn();
  const  beginRunData = jest.fn();
  const modelRan = jest.fn();
 const setDownloadFileName = jest.fn();
 const flowValues = {
   stopModel, beginRunData, modelRan, setDownloadFileName
 }

  const paramsValues = { params: {}}
  const wrapper = (props) => {
   flowValues.state = props;
    return render(
      <HelpContext.Provider value={helpValues}>
        <ParamsContext.Provider value={paramsValues}>
          <FlowContext.Provider value={flowValues}>
            <RunButton />
          </FlowContext.Provider>
        </ParamsContext.Provider>
      </HelpContext.Provider>);
  }

  test('it renders without error', () => {
    let {queryByTestId} = wrapper({runDisabled: true});
    let runComponent = queryByTestId('run-component');
    expect(runComponent).toBeInTheDocument();
  });

  describe('when disabled', () => {

    test('Has the disabled class', () => {
      let {queryByTestId} = wrapper({runDisabled: true});
      const inputBtn = queryByTestId('run-component-btn');
      expect(inputBtn).toHaveClass('disabled');
    });

    test('Cannot call run data', () => {
      let {queryByTestId} = wrapper({runDisabled: true});
      const inputBtn = queryByTestId('run-component-btn');
      userEvent.click(inputBtn);
      expect(setHelpText).not.toHaveBeenCalled();
    });
  })

  describe('when enabled', () => {

    test('Does not have the disabled class', () => {
      let { queryByTestId} = wrapper({runDisabled: false});
      const inputBtn = queryByTestId('run-component-btn');
      expect(inputBtn).not.toHaveClass('disabled');
    });

    test('Can call run data', () => {
      let { queryByTestId} = wrapper({runDisabled: false});
      const inputBtn = queryByTestId('run-component-btn');
      userEvent.click(inputBtn);
      expect(runModel).toHaveBeenCalled();
    });
  })


});
