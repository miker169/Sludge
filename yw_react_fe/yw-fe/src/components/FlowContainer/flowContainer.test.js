import React  from 'react';
import { render } from '@testing-library/react';
import FlowContainer from "./index";

describe('<FlowContainer/>', () => {
  test('it renders without error',  () => {
    const {queryByTestId} = render(<FlowContainer/>);
    const flowElement = queryByTestId('component-flow');
    expect(flowElement).toBeInTheDocument();
  });
});
