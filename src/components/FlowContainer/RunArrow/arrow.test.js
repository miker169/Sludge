import React from 'react';
import { render} from "@testing-library/react";
import RunArrow from "./index";
import {FlowContext} from "../../../context/FlowContext";

describe("<RunArrow/>", () => {
  const wrapper = (state) => {
    return render(<FlowContext.Provider value={{state}}><RunArrow /></FlowContext.Provider>);
  }


  test('It renders without error', () => {
    const {queryByTestId} = wrapper({nextArrowDisabled: true, nextArrowRan: false});
    const nextArrow = queryByTestId('next-arrow-component');
    expect(nextArrow).toBeInTheDocument();
  });

  describe('when disabled', () => {

    test('The disabled class is applied', () => {
      const {queryByTestId} = wrapper({nextArrowDisabled: true, nextArrowRan: false});
      const updateComponent = queryByTestId('run-component-arrow');
      expect(updateComponent).toHaveClass('disabled');
    });
  })

  describe('when ran', () => {

    it('the ran class is applied', () => {
      const {queryByTestId} = wrapper({nextArrowDisabled: false, nextArrowRan: true});
      const updateComponent = queryByTestId('run-component-arrow');
      expect(updateComponent).toHaveClass('ran');
    });

  })
});
