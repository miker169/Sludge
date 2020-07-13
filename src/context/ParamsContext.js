import React from "react";
import moment from "moment";

export const ParamsContext = React.createContext();

export const ParamsContextProvider = ({children}) => {
  const [paramsStartDate, setParamsStartDate] = React.useState(moment(new Date()));
  const [paramsList, setParamsList] = React.useState({});
  const [params, setParams] = React.useState({
    distanceCalibration: 2,
    driversLiquid: 4,
    driversCake: 1,
    kmperdriverliquid: 250,
    kmperdrivercake: 225,
  });

  const [weekdayParams, setWeekdayParams] = React.useState({
    distanceCalibration: 2,
    driversLiquid: 4,
    driversCake: 1,
    kmperdriverliquid: 250,
    kmperdrivercake: 225,
  })

  const [weekendParams, setWeekEndParams] = React.useState({
    distanceCalibration: 2,
    driversLiquid: 4,
    driversCake: 1,
    kmperdriverliquid: 250,
    kmperdrivercake: 225,
  })

  return (
    <ParamsContext.Provider value={{paramsList, setParamsList, paramsStartDate, setParamsStartDate, params, setParams, setWeekdayParams, weekdayParams, setWeekEndParams, weekendParams}}>
      {children}
    </ParamsContext.Provider>
  )
}
