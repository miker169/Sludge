import React from "react";
import scenario from "../context/scenario";
import importOptionBuilder from "../lib/inputOptionBuilder";

export default () => {
  const [inputOptions, setInputOptions] = React.useState([{...scenario, row: 1}])

  const handleScenarioSelection = (option) => {
    importOptionBuilder.buildInputOption(setInputOptions, inputOptions)(option);
  }

  return [handleScenarioSelection, inputOptions]
}
