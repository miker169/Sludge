import React from 'react';
import './List.css'
import ListItem from "../ListItem";
import classNames from "classnames";

const List = ({options, next }) => {

  const [labelText, setLabelText] = React.useState('Please Select...')
  const [selected, setSelected] = React.useState(false);
  const [listOptions, setSelectedListOptions] = React.useState(options);

  const handleSelected = (option) => {
    debugger;
    setSelected(!selected);
    setLabelText(option.label);
    const newSelectedOptions = listOptions.map(o => ({
      ...o,
      selected: option.id === o.id
    }));
    setSelectedListOptions(newSelectedOptions);
  }

  return (
    <div className="dropdown">
      <div data-testid="drop-down-label" className="dropdown-label">{labelText}</div>
        <div className="dropdown-menu">
          <ul className="submenu" data-testid="scenario-dropdown-component" name="modelling">
            {options.map((option) =>
                <ListItem
                  next={next}
                  selected={option.selected}
                  setLabelText={handleSelected}
                  key={option.id}
                  option={option} />)
            }
          </ul>
        </div>
    </div>
  )
}

export default List;
