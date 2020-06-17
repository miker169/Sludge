import React from 'react'
import './FormField.css'

const FormField = ({label, type}) => {
  return (
    <div className="field">
      <label placeholder={label} className="field-label">{label}</label>
      <input className="field-input" type="text"/>
    </div>
  )
}

export default FormField;
