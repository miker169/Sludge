import React from 'react';
import classNames from 'classnames';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown } from "@fortawesome/free-solid-svg-icons"

import './listItem.css'

const ListItem = ({option, next, first, setLabelText, selected}) => {
  let listClass = classNames({
    'selected': !!selected,
    'option': true,
  })

  const buildFirst = () => {
    return (
      <li
        className='firstOption'
        key="test-key"
        data-testid="list-item-component"
      >Please Select
        <span className="select-icon">
          <FontAwesomeIcon size={"2x"} icon={faCaretDown} />
          </span>
      </li>
    )
  }
  return (
    <>
      {first
        ? buildFirst()
        : <>
          <li
            className={listClass}
            data-testid="list-item-component"
            onClick={() => {
              setLabelText(option)
              next(option);
            }}
          >{option.label}</li>
        </>
      }
    </>
  );
}

export default ListItem;
