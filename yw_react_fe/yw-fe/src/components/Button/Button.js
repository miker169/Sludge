import React from 'react';
import classNames from 'classnames';
import './Buttton.css'

const Button = ({active, title, classes}) => {

  let btnClass = classNames({
    'active': !!active,
  }, classes)
  return(
    <a data-testid="component-btn" className={btnClass}>{title}</a>
  )
}

export default Button;
