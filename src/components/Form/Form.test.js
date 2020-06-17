import { render } from '@testing-library/react';
import React from 'react'
import Form from "./index";

describe('<Form/>', () => {
  const fields = [
    {
      "name": "Cost",
      "type": "Number",
      "unit": "Money"
    },
    {
      "name": "Dosage",
      "type": "Number",
      "unit": "Litres"
    }];
  const wrapper = () => {
    return render(<Form fields={fields}/>);
  }

  test('renders without error', () => {
    const {queryByTestId} = wrapper()
    const formComponent = queryByTestId('form-component');
    expect(formComponent).toBeInTheDocument();
  });

  test('renders a form field for every field item', () => {
    const {queryAllByTestId} = wrapper();
    const formFieldComponents = queryAllByTestId('form-field');
    expect(formFieldComponents.length).toBe(2);

  })


});
