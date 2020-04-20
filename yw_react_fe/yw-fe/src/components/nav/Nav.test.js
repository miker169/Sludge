import React from 'react';
import { render } from '@testing-library/react';
import Nav from './Nav';


describe('<Nav/>', () => {
  test('renders without error', () => {
     const { queryByTestId } = render(<Nav />);
    const navElement = queryByTestId('nav-container')
    expect(navElement).toBeInTheDocument();
  })
});
