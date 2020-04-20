import React from 'react';
import { render } from '@testing-library/react';
import Header from "./header";


describe('<Header/>', () => {
  test('renders without error', () => {
    const { queryByTestId } = render(<Header />);
    const navElement = queryByTestId('header-container')
    expect(navElement).toBeInTheDocument();
  });
})
