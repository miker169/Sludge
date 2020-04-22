import React from 'react';
import classNames from 'classnames';
import './Buttton.css'

const Button = ({active, title, classes, name, disabled, clickHandler}) => {

  let btnClass = classNames({
    'active': !!active,
    'disabled': disabled
  }, classes)

  return(
    <a onClick={clickHandler} data-testid={`${name}-component-btn`} className={btnClass}>{title}</a>
  )
}

export default Button;
