import React from "react";

export default (options, buildScenario) => {
  const [labelText, setLabelText] = React.useState('Please Select...');
  const [listOptions, setSelectedListOptions] = React.useState(options);


  const listItemSelectHandler = (option) => {
    setLabelText(option.label);
    buildScenario(option);
    const newSelectedOptions = listOptions.map(o => ({
      ...o,
      selected: option.id === o.id
    }));
    setSelectedListOptions(newSelectedOptions);
  }

  return [labelText, listItemSelectHandler]
}
