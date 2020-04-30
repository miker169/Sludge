import React  from 'react';
import { render } from '@testing-library/react';
import FlowContainer from "./index";
import { Provider as FlowProvider } from "../../context/FlowContext";

describe('<FlowContainer/>', () => {
  const wrapper = () => {

    return render(
      <FlowProvider >
        <FlowContainer />
      </FlowProvider>
      );
  }

  test('is disabled by default', () => {
    const {queryByTestId} = wrapper();
    const flowElement = queryByTestId('component-flow');
    expect(flowElement).toBeFalsy();
  });

  describe('When First Enabled', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state:  { enabled: true },
          start: jest.fn()
        }
      })
    });
    test('Shows the Flow Component', () => {
      const {queryByTestId} = wrapper();
      const flowElement = queryByTestId('component-flow');
      expect(flowElement).toBeTruthy();
    });
  })


});
