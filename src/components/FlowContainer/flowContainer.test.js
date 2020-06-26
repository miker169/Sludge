import React  from 'react';
import { render } from '@testing-library/react';
import FlowContainer from "./index";
import { HelpContextProvider} from "../../context/HelpContext";

describe('<FlowContainer/>', () => {
  const wrapper = (props) => {

    return render(<HelpContextProvider><FlowContainer {...props} /></HelpContextProvider>);
  }

  test('is disabled by default', () => {
    const {queryByTestId} = wrapper();
    const flowElement = queryByTestId('component-flow');
    expect(flowElement).toBeFalsy();
  });

  describe('When First Enabled', () => {

    test('Shows the Flow Component', () => {
      const {queryByTestId} = wrapper({ enabled: true });
      const flowElement = queryByTestId('component-flow');
      expect(flowElement).toBeTruthy();
    });
  })


});
