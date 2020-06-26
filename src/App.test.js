import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders The App without error', () => {
  const { queryByTestId } = render(<App />);
  const app = queryByTestId('app');
  expect(app).toBeInTheDocument();
});
