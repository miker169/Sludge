import React from 'react';
import { render} from "@testing-library/react";
import Main from './index';
import {HelpContextProvider} from "../../context/HelpContext";
import useAppState from "../../hooks/useAppState";
jest.mock('../../hooks/useAppState');

describe('<Main/>',  () => {
  const wrapper = () => {
    return render(<HelpContextProvider><Main/></HelpContextProvider>);
  }
  test('it renders without error', () => {
    useAppState.mockImplementation(() => ({
      setEnabled: jest.fn(),
      state: {
        payload: null
      },
    }));
    const {queryByTestId } = wrapper();
    const mainComponent = queryByTestId('component-main');
    expect(mainComponent).toBeInTheDocument();
  });


  describe('When disabled', () => {
    test('Displays the input field', () => {
      useAppState.mockImplementation(() => ({
        state: {
          payload: null,
          enabled: false
        },
        setEnabled: jest.fn()
      }));
      const {queryByTestId } = wrapper();
      const inputComponent = queryByTestId('component-file-upload');
      expect(inputComponent).toBeInTheDocument();
    });

  });

  describe('When enabled', () => {

    test('Hides the input field', () => {
      useAppState.mockImplementation(() => ({
        state: {
          payload: null,
          enabled: true
        },
      }));
      const {queryByTestId } = wrapper();
      const inputComponent = queryByTestId('component-file-upload');
      expect(inputComponent).not.toBeInTheDocument();
    });
  });


})
