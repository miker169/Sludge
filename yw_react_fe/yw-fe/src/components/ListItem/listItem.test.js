import React from 'react'
import { render } from '@testing-library/react'
import ListItem from "./index";
import userEvent from "@testing-library/user-event";

describe('<ListItem/>', () => {
  let showNextMock = jest.fn();
  const wrapper = () => {
    return render(<ListItem setLabelText={jest.fn()} next={showNextMock} option={{id:1, label: 'test'}}/>);
  }
  test('renders without error', () => {
    const { queryByTestId } = wrapper();
    const listItemComponent = queryByTestId('list-item-component');
    expect(listItemComponent).toBeInTheDocument();
  });

  describe('When clicked', () => {
    let listItemComponent;
    beforeEach(() => {
      const { queryByTestId } = wrapper();
      listItemComponent = queryByTestId('list-item-component');
      userEvent.click(listItemComponent);
    });

   test('calls showNext', () => {
     expect(showNextMock).toHaveBeenCalled();
   });
  });
})
