import React from 'react'
import { render } from '@testing-library/react';
import Help from './index';
import {Provider as FlowProvider } from "../../context/FlowContext";


describe('<Help/>', () => {
  const wrapper = () => {
    return render(<FlowProvider><Help/></FlowProvider>);
  }

  const helpText = "text text";
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(React, 'useContext')
    .mockImplementation((context) => {
      return {
        state: {helpText},
        start: jest.fn()
      }
    })
  });

  test('renders without error', () => {
    let {queryByTestId} = wrapper();
    const help = queryByTestId('component-help');
    expect(help).toBeInTheDocument();
  });

  test('Shows help text returned from context', () => {
    let {queryByTestId} = wrapper();
    const help = queryByTestId('component-help');
    expect(help.textContent).toBe(helpText);
  });

})
