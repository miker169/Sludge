import React from 'react';
import { render} from "@testing-library/react";
import FlowHelp from "./index";

describe("<FlowHelp/>", () => {
  const wrapper = (props) => {
    return render(<FlowHelp {...props} />);
  }
  it('renders without error', () => {
    const {queryByTestId} = wrapper();
    const flowHelpComponent = queryByTestId('flow-help');
    expect(flowHelpComponent).toBeInTheDocument();
  });

  it('renders the help text passed to it', () => {
    const {queryByTestId} = wrapper({helpText: 'Test'});
    const flowHelpComponent = queryByTestId('helpText');
    expect(flowHelpComponent.textContent).toBe('Test');

  })
});
