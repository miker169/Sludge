import React from "react";
import moment from "moment";

export const ParamsContext = React.createContext();

export const ParamsContextProvider = ({children}) => {
  const buildWeekendDates = (startDate, endDate) => {
    let dates = [];
    if (startDate.isoWeekday() === 6 || startDate.isoWeekday() === 7) {
      dates.push(startDate.clone().format('DD/MM/YYYY'));
    }

    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      if (currDate.isoWeekday() === 6 || currDate.isoWeekday() === 7) {
        dates.push(currDate.clone().format('DD/MM/YYYY'));
      }
    }
    if (endDate.isoWeekday() === 6 || endDate.isoWeekday() === 7) {
      dates.push(endDate.clone().format('DD/MM/YYYY'));
    }
    return dates;
  }
  const buildWeekDays = (startDate, endDate) => {
    let dates = [];
    if (startDate.isoWeekday() !== 6 && startDate.isoWeekday() !== 7) {
      dates.push(startDate.clone().format('DD/MM/YYYY'));
    }

    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      if (currDate.isoWeekday() !== 6 && currDate.isoWeekday() !== 7) {
        dates.push(currDate.clone().format('DD/MM/YYYY'));
      }
    }
    if (endDate.isoWeekday() !== 6 && endDate.isoWeekday() !== 7) {
      dates.push(endDate.clone().format('DD/MM/YYYY'));
    }
    return dates;
  }
  const setDefaultParams = (value, name) => {
    setParams(prevState => {
      return {...prevState, [name]: value}
    })
    setWeekdayParams(prevState => {
      return {...prevState, [name]: value}
    })
    setWeekEndParams(prevState => {
      return {...prevState, [name]: value}
    })

    for (let date in paramsList) {
      paramsList[date][name] = value;
    }

    setParamsList(paramsList)

  }
  const setWeekendDefaults = (value, name) => {
    setWeekEndParams(prevState => {
      return {...prevState, [name]: value}
    });
    const weekendDays = buildWeekendDates(paramsStartDate, endDate);
    for (let date of weekendDays) {
      paramsList[date][name] = value
    }
    setParamsList(paramsList)
  }
  const setWeekDayDefaults = (value, name) => {
    setWeekdayParams(prevState => {
      return {...prevState, [name]: value}
    });
    const newParams = {...params, [name]: value}
    const weekDays = buildWeekDays(paramsStartDate, endDate);

    for (let date of weekDays) {
      paramsList[date][name] = value;
    }
    setParamsList(paramsList)
  }
  const setParamItem = (value, name, date) => {
    const currentParams = paramsList[date];
    const newParams = {...currentParams, [name]: value}

    paramsList[date] = newParams;
    const newParamsList = {...paramsList}
    setParamsList(newParamsList)
  }

  const enumerateDaysBetweenDates = (startDate, endDate) => {
    let dates = [];
    dates.push(startDate.clone().format('DD/MM/YYYY'));

    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      console.log(currDate.toDate());
      dates.push(currDate.clone().format('DD/MM/YYYY'));
    }

    dates.push(endDate.clone().format('DD/MM/YYYY'));

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
    <ParamsContext.Provider value={{
      paramsList,
      setParamsList,
      paramsStartDate,
      setParamsStartDateHook,
      params,
      setParams,
      setWeekdayParams,
      weekdayParams,
      setWeekEndParams,
      weekendParams,
      paramsDates,
      setParamsDates,
      setDefaultParams,
      setWeekendDefaults,
      setWeekDayDefaults,
      setParamItem
    }}>
      {children}
    </ParamsContext.Provider>
  )
}
