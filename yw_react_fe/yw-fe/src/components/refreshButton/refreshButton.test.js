import React from 'react';
import { render } from "@testing-library/react";
import RefreshButton from "./index";
import { Provider as FlowProvider } from '../../context/FlowContext';
import userEvent from "@testing-library/user-event";

describe('<RefreshButton/>', () => {
  const wrapper = () => {
    return render(
      <FlowProvider>
        <RefreshButton/>
      </FlowProvider>
    );
  }
  it('renders without error', () => {
    const { queryByTestId } = wrapper();
    const refreshButton = queryByTestId('refresh-btn');
    expect(refreshButton).toBeInTheDocument();
  });

  describe('on click', () => {
    let refreshMock = jest.fn()
    beforeEach(() => {
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          refresh: refreshMock
        }
      });
      const {queryByTestId} = wrapper();
      const refreshClickComponent = queryByTestId('refreshClickHandler');
      userEvent.click(refreshClickComponent);
    });

    test('it calls refresh method in the context', () => {
      expect(refreshMock).toHaveBeenCalled();
    });
  })
})
