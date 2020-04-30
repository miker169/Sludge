import React from 'react';
import { render} from "@testing-library/react";
import RunArrow from "./index";
import {Provider as FlowProvider } from "../../../context/FlowContext";

describe("<RunArrow/>", () => {
  const wrapper = () => {
    return render(<FlowProvider><RunArrow/></FlowProvider>);
  }

  let state = {nextArrowDisabled: true, nextArrowRan: false}

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
    const nextArrow = queryByTestId('next-arrow-component');
    expect(nextArrow).toBeInTheDocument();
  });

  describe('when disabled', () => {

    beforeEach(()=> {
      setState({nextArrowDisabled: true, nextArrowRan: false})
    });

    test('The disabled class is applied', () => {
      const {queryByTestId} = wrapper();
      const updateComponent = queryByTestId('run-component-arrow');
      expect(updateComponent).toHaveClass('disabled');
    });
  })

  describe('when ran', () => {
    beforeEach(()=> {
      setState({nextArrowDisabled: false, nextArrowRan: true})
    });

    it('the ran class is applied', () => {
      const {queryByTestId} = wrapper();
      const updateComponent = queryByTestId('run-component-arrow');
      expect(updateComponent).toHaveClass('ran');
    });

  })
});
