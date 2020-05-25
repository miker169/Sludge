import React from 'react';
import { render } from "@testing-library/react";
import Update from "./index";

describe('<Update/>',  () => {
  const wrapper = (props) => {
    return render(<Update {...props}/>);
  }

  // let state = {inputArrowDisabled: true, inputArrowRan: false}
  //
  // const setState = (newState) => {
  //   state = newState;
  // }


  test('It renders without error', () => {
    const {queryByTestId} = wrapper();
    const updateComponent = queryByTestId('update-component');
    expect(updateComponent).toBeInTheDocument();
  });

  describe('when disabled', () => {


    test('The disabled class is applied', () => {
      const {queryByTestId} = wrapper({inputArrowDisabled: true, inputArrowRan: false});
      const updateComponent = queryByTestId('input-component-arrow');
      expect(updateComponent).toHaveClass('disabled');
    });
  })

  describe('when ran', () => {

    it('the ran class is appled', () => {
      const {queryByTestId} = wrapper({inputArrowDisabled: false, inputArrowRan: true});
      const updateComponent = queryByTestId('input-component-arrow');
      expect(updateComponent).toHaveClass('ran');
    });

  })


});
