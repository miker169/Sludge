import React from 'react';
import classNames from 'classnames';
import './Buttton.css'

const Button = ({active, title, classes, name, disabled, clickHandler,url}) => {

  let btnClass = classNames({
    'active': !!active,
    'disabled': disabled
  }, classes)

  return(
    <a onClick={clickHandler} href={url} data-testid={`${name}-component-btn`} className={btnClass}>{title}</a>
  )
}

export default Button;
