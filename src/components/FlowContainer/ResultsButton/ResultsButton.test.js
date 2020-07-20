import React from 'react';
import { render } from '@testing-library/react';
import ResultsButton from "./index";
import { FlowContext } from '../../../context/FlowContext'


describe('<ResultsButton/>', () => {

  const wrapper= (props, state) => {
    const flowValue = {
      state
    }
    return render(
      <FlowContext.Provider value={flowValue}>
        <ResultsButton {...props}/>
      </FlowContext.Provider>)
  }

  it('renders without error', () => {
    const { queryByTestId } = wrapper(undefined,{downloadFileName: ''});
    const resultsBtn = queryByTestId('results-component');
    expect(resultsBtn).toBeInTheDocument();
  });

  describe('when disabled', () => {


    test('should have class disabled', () => {
      const {queryByTestId } = wrapper(undefined, {downloadFileName: '', getResultsDisabled: true});
      const resultsBtn = queryByTestId('results-component-btn');
      expect(resultsBtn).toHaveClass('disabled')
    });

  });

  describe('when not disabled', () => {

    test('should not have class disabled', () => {
      const {queryByTestId } = wrapper(undefined,{downloadFileName: '', getResultsDisabled: false});
      const resultsBtn = queryByTestId('results-component-btn');
      expect(resultsBtn).not.toHaveClass('disabled')
    });

  })
});
