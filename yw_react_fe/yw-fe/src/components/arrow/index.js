import React from 'react';
import './arrow.css';
import classNames from "classnames";

const Arrow = ({path="M20 40 L 180 40", children, disabled, name, ran} ) => {

  let arrowClass = classNames({
    'disabled': disabled,
    'arrow': true,
    'ran': ran
  })

  return (
    <svg x="0px" y="0px" >
      <defs>
        <marker fill="#FFF" id="arrowhead" markerWidth="10" markerHeight="7"
                refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
      {children}
      <path
        data-testid={`${name}-component-arrow`}
        name={name}
        disabled={disabled}
        className={arrowClass}
        markerEnd="url(#arrowhead)"
        d={path}
      />
    </svg>
  )
}


export default Arrow;
