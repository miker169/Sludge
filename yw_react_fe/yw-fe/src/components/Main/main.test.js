import React from 'react';
import { render} from "@testing-library/react";
import Main from './index';
import { Provider as FlowProvider} from "../../context/FlowContext";

describe('<Main/>',  () => {
  const wrapper = () => {
    return render(<FlowProvider><Main/></FlowProvider>)
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
          state: {enabled: false},
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
          state: {enabled: true},
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
