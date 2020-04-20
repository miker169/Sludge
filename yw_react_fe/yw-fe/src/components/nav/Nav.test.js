import React from 'react';
import { render } from '@testing-library/react';
import Nav from './Nav';


describe('Nav', () => {
  // beforeEach(() => {
  //
  // })
})
test('renders learn react link', () => {
  const { queryByTestId } = render(<Nav />);
  const navElement = queryByTestId('nav-container')
  expect(navElement).toBeInTheDocument();
});
