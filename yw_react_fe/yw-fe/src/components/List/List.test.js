import React from 'react';
import { render } from '@testing-library/react';
import List from './index';
import userEvent from "@testing-library/user-event";
import { Provider as ScenarioProvider } from '../../context/ScenarioContext'

describe('<List/>', () => {
  let next = jest.fn()
  const wrapper = () => {
    const options = [{
      label: 'test',
      id: 1
    },
      {
        label: 'test2',
        id: 2
      }]
    return render(<List options={options} next={next}/>)
  }
  test('It renders without error', () => {
    const { queryByTestId} = wrapper();
    const dropdown = queryByTestId('scenario-dropdown-component');
    expect(dropdown).toBeInTheDocument();
  });

  describe('Drop Down List', () => {
    test('Displays a default selection', () => {
      const { queryByTestId} = wrapper();
      const dropdownOption = queryByTestId('drop-down-label');
      expect(dropdownOption.textContent).toBe('Please Select...');
    });
    describe('On Click', () => {
      let queryByTestId, queryAllByTestId;

      beforeEach(() => {
        ({queryByTestId, queryAllByTestId} = wrapper())
        const dropDown = queryByTestId('scenario-dropdown-component');
        userEvent.click(dropDown);
      });

      test('Displays a collection of items', () => {
        const dropdownOptions = queryAllByTestId('list-item-component');
        expect(dropdownOptions.length).toBe(2);
      });


    });

  });
});
