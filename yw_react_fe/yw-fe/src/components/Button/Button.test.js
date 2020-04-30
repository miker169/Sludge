import React from 'react';
import { render } from '@testing-library/react';
import Button from "./Button";

describe('<Button />', () => {
  let queryByTestId;
  const wrapper = (props) => {
    ({queryByTestId} = render(<Button {...props} name="test" />));
  }
  test('renders without error', () => {
    wrapper();
    const btnElement = queryByTestId('test-component-btn')
    expect(btnElement).toBeInTheDocument();
  });

  test('can be set to be active', () => {
    wrapper({active: true});
    const btnElement = queryByTestId('test-component-btn');
    expect(btnElement.classList.contains('active')).toBeTruthy();
  });

  test('can accept other classes', () => {
    wrapper({classes: ['class1']});
    const btnElement = queryByTestId('test-component-btn');
    expect(btnElement.classList.contains('class1')).toBeTruthy();
  })
});
