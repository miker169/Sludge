import React from "react";

export const FileContext = React.createContext();

export const FileContextProvider = ({children}) => {
  const [files, setFiles] = React.useState([]);

  const setFileHandler = (newFile) => {
    const newFiles = [...files, newFile ]
    setFiles(newFiles)
  }
  return (
    <FileContext.Provider value={{files, setFileHandler}}>
      {children}
    </FileContext.Provider>
  )
}
