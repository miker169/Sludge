import React from 'react';
import './form.css';
import FormField from "../FormField";

const Form = ({fields}) => {
  return (
    <div data-testid="form-component" className="scenario-form">
      {fields.map((f,idx) => <div key={idx} data-testid="form-field">
        <FormField label={f.name} type={f.type} />
      </div>)}
    </div>
  )
}

export default Form;
