import React from "react";
import moment from "moment";

export const ParamsContext = React.createContext();

export const ParamsContextProvider = ({children}) => {
  const enumerateDaysBetweenDates = (startDate, endDate) => {
    let dates = [];
    dates.push(startDate.clone().format('dddd Do of MMM YYYY'));

    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      console.log(currDate.toDate());
      dates.push(currDate.clone().format('dddd Do of MMM YYYY'));
    }

    dates.push(endDate.clone().format('dddd Do of MMM YYYY'));

    return dates;
  };

  const [paramsStartDate, setParamsStartDate] = React.useState(moment(new Date()));
  let endDate = paramsStartDate.clone().add(13, 'days');
  let dates = enumerateDaysBetweenDates(paramsStartDate, endDate);

  const [params, setParams] = React.useState({
    distanceCalibration: 2,
    driversLiquid: 4,
    driversCake: 1,
    kmperdriverliquid: 250,
    kmperdrivercake: 225,
  });
  const [paramsDates, setParamsDates] = React.useState(dates)
  const initialParamsList = {};
  dates.forEach((date) => {
    initialParamsList[date] = params
  })
  const [paramsList, setParamsList] = React.useState(initialParamsList);

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
  });

  const setParamsStartDateHook = (startDate) => {
    endDate = startDate.clone().add(13, 'days');
    setParamsStartDate(prevState => startDate);
    let dates = enumerateDaysBetweenDates(startDate, endDate);
    setParamsDates(prevDates => dates);
    const initialParamsList = {};
    dates.forEach((date) => {
      initialParamsList[date] = params
    })
    setParamsList(prevParamsList => initialParamsList)
  }

  return (
    <ParamsContext.Provider value={{paramsList, setParamsList, paramsStartDate, setParamsStartDateHook, params, setParams, setWeekdayParams, weekdayParams, setWeekEndParams, weekendParams, paramsDates, setParamsDates}}>
      {children}
    </ParamsContext.Provider>
  )
}
