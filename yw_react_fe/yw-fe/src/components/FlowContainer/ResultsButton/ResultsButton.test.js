import React from 'react';
import { render } from '@testing-library/react';
import ResultsButton from "./index";


describe('<ResultsButton/>', () => {
  const wrapper= (props) => {
    return render(<ResultsButton {...props}/>)
  }

  it('renders without error', () => {
    const {queryByTestId } = wrapper();
    const resultsBtn = queryByTestId('results-component');
    expect(resultsBtn).toBeInTheDocument();
  });

  describe('when disabled', () => {


    test('should have class disabled', () => {
      const {queryByTestId } = wrapper({disabled: true});
      const resultsBtn = queryByTestId('results-component-btn');
      expect(resultsBtn).toHaveClass('disabled')
    });

  });

  describe('when not disabled', () => {

    test('should not have class disabled', () => {
      const {queryByTestId } = wrapper({disabled: false});
      const resultsBtn = queryByTestId('results-component-btn');
      expect(resultsBtn).not.toHaveClass('disabled')
    });

  })
});
