import React from 'react';
import { render } from '@testing-library/react';
import Button from "./Button";

describe('<Button />', () => {
  let queryByTestId;
  const wrapper = (props) => {
    ({queryByTestId} = render(<Button {...props} />));
  }
  test('renders without error', () => {
    wrapper();
    const btnElement = queryByTestId('component-btn')
    expect(btnElement).toBeInTheDocument();
  });

  test('can be set to be active', () => {
    wrapper({active: true});
    const btnElement = queryByTestId('component-btn');
    expect(btnElement.classList.contains('active')).toBeTruthy();
  });

  test('can accept other classes', () => {
    wrapper({classes: ['class1']});
    const btnElement = queryByTestId('component-btn');
    expect(btnElement.classList.contains('class1')).toBeTruthy();
  })
});
