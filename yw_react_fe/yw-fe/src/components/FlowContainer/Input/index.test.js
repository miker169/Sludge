import React from 'react';
import {render} from "@testing-library/react";
import Input from "./index";
import { Provider as FlowProvider } from "../../../context/FlowContext";
import userEvent from "@testing-library/user-event";

describe('<Input/>', () => {
  const wrapper = () => {
    return render(<FlowProvider><Input/></FlowProvider>)
  }

  test('it renders without error', () => {
    const { queryByTestId } = wrapper();
    const Input = queryByTestId('input-static');
    expect(Input).toBeInTheDocument();
  });

  describe('when disabled', () => {
    let uploadDataMock = jest.fn();

    beforeEach(()=> {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: {inputDisabled: true},
          start: jest.fn(),
          uploadData: uploadDataMock
        }
      })
    });
    test('has the disabled class', () => {
      const {queryByTestId} = wrapper();
      const inputBtn = queryByTestId('input-component-btn');
      expect(inputBtn).toHaveClass('disabled');
    });

    test('Cannot call uploadData', () => {
      const {queryByTestId} = wrapper();
      const inputBtn = queryByTestId('input-component-btn');
      userEvent.click(inputBtn);
      expect(uploadDataMock).not.toHaveBeenCalled();
    });
  });

  describe('when enabled', () => {
    let uploadDataMock = jest.fn();

    beforeEach(()=> {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: {inputDisabled: false},
          start: jest.fn(),
          uploadData: uploadDataMock
        }
      })
    });
    test('does not have the disabled class', () => {
      const {queryByTestId} = wrapper();
      const inputBtn = queryByTestId('input-component-btn');
      expect(inputBtn).not.toHaveClass('disabled');
    });

    describe('when clicked', () => {
      let uploadDataMock = jest.fn();

      beforeEach(()=> {
        jest.clearAllMocks();
        jest.spyOn(React, 'useContext')
        .mockImplementation((context) => {
          return {
            state: {},
            start: jest.fn(),
            uploadData: uploadDataMock
          }
        })
      });
      test('It calls the uploadData function', () => {
        const {queryByTestId} = wrapper();
        const inputBtn = queryByTestId('input-component-btn');
        userEvent.click(inputBtn);
        expect(uploadDataMock).toHaveBeenCalled();
      });
    });
  });



});
