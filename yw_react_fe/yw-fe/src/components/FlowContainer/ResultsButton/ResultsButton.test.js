import React from 'react';
import { render } from '@testing-library/react';
import ResultsButton from "./index";
import { Provider as FlowProvider} from "../../../context/FlowContext";


describe('<ResultsButton/>', () => {
  const wrapper= () => {
    return render(<FlowProvider><ResultsButton/></FlowProvider>)
  }

  const setState = (newState) => {
    state = newState;
  }

  let state = {
    getResultsDisabled: false,
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(React, 'useContext')
    .mockImplementation((context) => {
      return {
        state: state,
        start: jest.fn()
      }
    })
  });

  it('renders without error', () => {
    const {queryByTestId } = wrapper();
    const resultsBtn = queryByTestId('results-component');
    expect(resultsBtn).toBeInTheDocument();
  });

  describe('when disabled', () => {
    beforeEach(() => {
      setState({getResultsDisabled: true})
    });

    test('should have class disabled', () => {
      const {queryByTestId } = wrapper();
      const resultsBtn = queryByTestId('results-component-btn');
      expect(resultsBtn).toHaveClass('disabled')
    });

  });

  describe('when not disabled', () => {
    beforeEach(() => {
      setState({getResultsDisabled: false})
    });

    test('should not have class disabled', () => {
      const {queryByTestId } = wrapper();
      const resultsBtn = queryByTestId('results-component-btn');
      expect(resultsBtn).not.toHaveClass('disabled')
    });

  })
});
