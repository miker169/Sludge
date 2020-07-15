import React from "react";

export const FileContext = React.createContext();

export const FileContextProvider = ({children}) => {
  const [files, setFiles] = React.useState([]);

  const setFileHandler = (newFile) => {
    const newFiles = [...files, newFile ]
    setFiles(newFiles)
  }

  const resetFiles = () => {
    setFiles([])
  }
  return (
    <FileContext.Provider value={{files, setFileHandler, resetFiles}}>
      {children}
    </FileContext.Provider>
  )
}
