import React from 'react';
import './arrow.css';

const Arrow = ({path="M20 40 L 180 40", children} ) => {

  return (
    <svg x="0px" y="0px" data-testid="component-arrow">
      <defs>
        <marker fill="#FFF" id="arrowhead" markerWidth="10" markerHeight="7"
                refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
      {children}
      <path
        className="arrow"
        markerEnd="url(#arrowhead)"
        d={path}
      />
    </svg>
  )
}


export default Arrow;
