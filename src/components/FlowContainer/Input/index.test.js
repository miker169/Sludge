import React from 'react';
import {render} from "@testing-library/react";
import Input from "./index";
import userEvent from "@testing-library/user-event";
import { HelpContextProvider} from "../../../context/HelpContext";
import useUploadData from "../../../hooks/useUploadFiles";
jest.mock('../../../hooks/useUploadFiles');

describe('<Input/>', () => {

  const wrapper = (props) => {
    return render(<HelpContextProvider><Input {...props}/></HelpContextProvider>)
  }

  test('it renders without error', () => {
    useUploadData.mockImplementation(() => ({
      uploadData: jest.fn()
    }));
    const { queryByTestId } = wrapper();
    const Input = queryByTestId('input-static');
    expect(Input).toBeInTheDocument();
  });

  describe('when disabled', () => {

    test('has the disabled class', () => {
      useUploadData.mockImplementation(() => ({
        uploadData: jest.fn()
      }));
      const {queryByTestId} = wrapper({disabled: true});
      const inputBtn = queryByTestId('input-component-btn');
      expect(inputBtn).toHaveClass('disabled');
    });

    test('Cannot call uploadData', () => {
      let uploadDataMock = jest.fn();
      useUploadData.mockImplementation(() => ({
        uploadData: uploadDataMock
      }));
      const {queryByTestId} = wrapper({disabled: true});
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
      useUploadData.mockImplementation(() => ({
        uploadData: jest.fn
      }));
      const {queryByTestId} = wrapper({disabled: false});
      const inputBtn = queryByTestId('input-component-btn');
      expect(inputBtn).not.toHaveClass('disabled');
    });

    describe('when clicked', () => {
      let toggleUpload = jest.fn();

      beforeEach(()=> {
        jest.clearAllMocks();
        jest.spyOn(React, 'useContext')
        .mockImplementation((context) => {
          return {
            state: {},
            start: jest.fn(),
            toggleUpload: toggleUpload
          }
        })
      });
      test('It calls the uploadData function', () => {
        const uploadDataMock = jest.fn();
        useUploadData.mockImplementation(() => ({
          uploadData: uploadDataMock
        }));
        const {queryByTestId} = wrapper();
        const inputBtn = queryByTestId('input-component-btn');
        userEvent.click(inputBtn);
        expect(useUploadData).toHaveBeenCalled();
      });
    });
  });



});
