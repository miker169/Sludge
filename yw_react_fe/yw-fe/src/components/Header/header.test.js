import React from 'react';
import { render } from '@testing-library/react';
import Header from "./header";


describe('<Header/>', () => {
  test('renders without error', () => {
    const { queryByTestId } = render(<Header />);
    const navElement = queryByTestId('header-container')
    expect(navElement).toBeInTheDocument();
  });

  test('Displays a user name', () => {
    const { queryByTestId } = render(<Header />);
    const navElement = queryByTestId('welcome')
    expect(navElement).toBeInTheDocument();
  })
})
