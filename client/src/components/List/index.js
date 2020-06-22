import React from 'react';
import './List.css'
import ListItem from "../ListItem";
import useSelectListItem from "../../hooks/useSelectListItem";

const List = ({options, handleScenarioSelection }) => {
  const [labelText, listItemSelectHandler ] = useSelectListItem(options, handleScenarioSelection);

  return (
    <div className="dropdown">
      <div data-testid="drop-down-label" className="dropdown-label">{labelText}</div>
        <div className="dropdown-menu">
          <ul className="submenu" data-testid="scenario-dropdown-component" name="modelling">
            {options.map((option) =>
                <ListItem
                  handleSelected={listItemSelectHandler}
                  key={option.id}
                  option={option} />)
            }
          </ul>
        </div>
    </div>
  )
}

export default List;
