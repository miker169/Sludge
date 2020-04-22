import React from 'react';
import { render} from "@testing-library/react";
import Main from './index';
import { Provider as FlowProvider} from "../../context/FlowContext";

describe('<Main/>',  () => {
  const wrapper = () => {
    return render(<FlowProvider><Main/></FlowProvider>)
  }
  test('it renders without error', () => {
    const {queryByTestId } = wrapper();
    const mainComponent = queryByTestId('component-main');
    expect(mainComponent).toBeInTheDocument();
  });
})
