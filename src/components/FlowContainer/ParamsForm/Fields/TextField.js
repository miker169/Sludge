import React from "react";
import classNames from 'classnames';

const TextField = React.memo(({name, placeholder, title, setField, value}) => {

  const [hasError, setError] = React.useState(false);
  const [errorString, setErrorString] = React.useState("")

  const onChangeHandler = React.useCallback((e) => {
    const inputValue = e.target.value;
    setField(e);

    if (inputValue === '' || inputValue === '0') {
      setErrorString('Value cannot be blank or zero');
      setError(true);
    }else if( !isNaN(inputValue) && parseFloat(inputValue) < 0 ){
      setErrorString('Value cannot be negative');
      setError(true);
    } else {
      setError(false)
    }
  },[setField])

  const inputClass = classNames({
    'field-input': true,
    'inputError': hasError
  });

  const labelClass = classNames({
    'params-label': true,
    'inputError': hasError

  })

  return (
    <div className="params-field">
      <label htmlFor={name} placeholder={placeholder} className={labelClass}>{title}</label>
      <input id={name} onChange={onChangeHandler} name={name} value={value}
             className={inputClass} type="text"/>
      {hasError ? <span className="errorSpan">{errorString}</span> : null}
    </div>
  );
})

export default TextField
