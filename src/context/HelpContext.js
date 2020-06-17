import React from "react";

export const HelpContext = React.createContext();

export const HelpContextProvider = ({children}) => {
  const [helpText, setHelpText] = React.useState('Upload the following files');
  const [errorText, setErrorText] = React.useState([]);
  return (
    <HelpContext.Provider value={{helpText, errorText, setHelpText, setErrorText}}>
      {children}
    </HelpContext.Provider>
  )
}


