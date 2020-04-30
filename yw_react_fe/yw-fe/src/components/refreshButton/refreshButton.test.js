import React from 'react';
import { render } from "@testing-library/react";
import RefreshButton from "./index";

describe('<RefreshButton/>', () => {
  const wrapper = () => {
    return render(<RefreshButton/>);
  }
  it('renders without error', () => {
    const { queryByTestId } = wrapper();
    const refreshButton = queryByTestId('refresh-btn');
    expect(refreshButton).toBeInTheDocument();
  });
})
