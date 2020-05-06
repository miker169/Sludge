import React from 'react';
import './listItem.css'

const ListItem = ({option, handleSelected}) => {

  return (
    <>
      <li
        className='option'
        data-testid="list-item-component"
        onClick={() => {
          handleSelected(option)
        }}
      >{option.label}</li>
    </>
  );
}

export default ListItem;
