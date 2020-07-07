import React from "react";
import moment from "moment";

export const ParamsContext = React.createContext();

export const ParamsContextProvider = ({children}) => {
  const [paramsStartDate, setParamsStartDate] = React.useState(moment(new Date()));
  const [paramsList, setParamsList] = React.useState([]);
  return (
    <ParamsContext.Provider value={{paramsList, setParamsList, paramsStartDate, setParamsStartDate}}>
      {children}
    </ParamsContext.Provider>
  )
}
