import React from 'react';
import { render } from "@testing-library/react";
import RefreshButton from "./index";
import userEvent from "@testing-library/user-event";

describe('<RefreshButton/>', () => {
  const wrapper = (props) => {
    return render(
        <RefreshButton {...props}/>
    );
  }
  test('renders without error', () => {
    const { queryByTestId } = wrapper();
    const refreshButton = queryByTestId('refresh-btn');
    expect(refreshButton).toBeInTheDocument();
  });

  describe('on click', () => {
    let refreshMock = jest.fn()

    test('it calls refresh method in the context', () => {
      const {queryByTestId} = wrapper({onClickHandler:refreshMock});

      const refreshClickComponent = queryByTestId('refreshClickHandler');
      userEvent.click(refreshClickComponent);
      expect(refreshMock).toHaveBeenCalled();
    });
  })
})
