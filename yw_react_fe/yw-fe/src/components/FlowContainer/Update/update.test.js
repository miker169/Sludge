import React from 'react';
import { render } from "@testing-library/react";
import Update from "./index";
import {Provider as FlowProvider } from "../../../context/FlowContext";

describe('<Update/>',  () => {
  const wrapper = () => {
    return render(<FlowProvider><Update/></FlowProvider>);
  }

  let state = {inputArrowDisabled: true, inputArrowRan: false}

  const setState = (newState) => {
    state = newState;
  }

  beforeEach(()=> {
    jest.clearAllMocks();
    jest.spyOn(React, 'useContext')
    .mockImplementation((context) => {
      return {
        state: state,
      }
    })
  });

  test('It renders without error', () => {
    const {queryByTestId} = wrapper();
    const updateComponent = queryByTestId('update-component');
    expect(updateComponent).toBeInTheDocument();
  });

  describe('when disabled', () => {

    beforeEach(()=> {
      setState({inputArrowDisabled: true, inputArrowRan: false})
    });

    test('The disabled class is applied', () => {
      const {queryByTestId} = wrapper();
      const updateComponent = queryByTestId('input-component-arrow');
      expect(updateComponent).toHaveClass('disabled');
    });
  })

  describe('when ran', () => {
    beforeEach(()=> {
      setState({inputArrowDisabled: false, inputArrowRan: true})
    });

    it('the ran class is appled', () => {
      const {queryByTestId} = wrapper();
      const updateComponent = queryByTestId('input-component-arrow');
      expect(updateComponent).toHaveClass('ran');
    });

  })


});
