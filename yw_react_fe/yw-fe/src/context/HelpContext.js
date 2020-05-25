import React from "react";

export const HelpContext = React.createContext();

export const HelpContextProvider = ({children}) => {
  const [helpText, setHelpText] = React.useState('Upload the following files');
  return (
    <HelpContext.Provider value={{helpText, setHelpText}}>
      {children}
    </HelpContext.Provider>
  )
}


