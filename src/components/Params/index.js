import React from 'react'
import ParamsForm from "../FlowContainer/ParamsForm";
import GranularDayAccordion from "../ParamsAccordion/GranularDayAccordion";
import WeekendAccordion from '../ParamsAccordion/WeekendAccordion'
import WeekdayAccordion from "../ParamsAccordion/WeekdayAccordion";
import ParamsAccordion from '../ParamsAccordion'
import moment from "moment";
import {ParamsContext} from "../../context/ParamsContext";


const Params = () => {
  const { paramsStartDate, setParams, params,setWeekdayParams, weekdayParams, setWeekEndParams, weekendParams, paramsList, setParamsList, paramsDates } = React.useContext(ParamsContext);

  let endDate = paramsStartDate.clone().add(13, 'days');


  const buildWeekendDates = (startDate, endDate) => {
    let dates = [];
    if(startDate.isoWeekday() === 6 || startDate.isoWeekday() === 7) {
      dates.push(startDate.clone().format('dddd Do of MMM YYYY'));
    }

    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      if(currDate.isoWeekday() === 6 || currDate.isoWeekday() === 7) {
        dates.push(currDate.clone().format('dddd Do of MMM YYYY'));
      }
    }
    if(endDate.isoWeekday() === 6 || endDate.isoWeekday() === 7){
      dates.push(endDate.clone().format('dddd Do of MMM YYYY'));
    }
    return dates;
  }

  const weekEndDates = buildWeekendDates(paramsStartDate, endDate);

  const buildWeekDays = (startDate, endDate) => {
    let dates = [];
    if(startDate.isoWeekday() !== 6 && startDate.isoWeekday() !== 7) {
      dates.push(startDate.clone().format('dddd Do of MMM YYYY'));
    }

    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      if(currDate.isoWeekday() !== 6 && currDate.isoWeekday() !== 7) {
        dates.push(currDate.clone().format('dddd Do of MMM YYYY'));
      }
    }
    if(endDate.isoWeekday() !== 6 && endDate.isoWeekday() !== 7){
      dates.push(endDate.clone().format('dddd Do of MMM YYYY'));
    }
    return dates;
  }

  const setDefaultParams = (value, name) => {
    setParams (prevState => {
      return { ...prevState, [name]:value }
    })
    setWeekdayParams(prevState => {
      return {...prevState, [name]: value}
    })
    setWeekEndParams(prevState => {
      return {...prevState, [name]: value}
    })

    const newParamsList = {};
    const newParams = {...params, [name]:value}
    paramsDates.forEach((date) => {
      newParamsList[date] = newParams
    })

    setParamsList(newParamsList)

  }

  const setWeekendDefaults = (value, name) => {
    setWeekEndParams(prevState => {
      return {...prevState, [name]: value}
    });

    const newParams = {...params, [name]:value}
    const weekendDays = buildWeekendDates(paramsStartDate, endDate);
    weekendDays.forEach((date) => {
      paramsList[date] = newParams
    })

    setParamsList(paramsList)
  }


  const setWeekDayDefaults = (value, name) => {
    setWeekdayParams(prevState => {
      return {...prevState, [name]: value}
    });

    const newParams = {...params, [name]:value}
    const weekDays = buildWeekDays(paramsStartDate, endDate);
    weekDays.forEach((date) => {
      paramsList[date] = newParams
    })
    setParamsList(paramsList)
  }


  const setParamItem = (value,name, date) => {
    const currentParams = paramsList[date];
    const newParams = {...currentParams, [name]:value}

    paramsList[date] = newParams;
    const newParamsList = {...paramsList}
    setParamsList(newParamsList)
  }


  return (
    <div data-testid="component-main" className="mainContainer">
      <h2 className="header">Sludge Modelling Parameters</h2>
      <ParamsAccordion>
        <ParamsForm disabled={false} setParams={setDefaultParams} params={params} title="Default All" />
      </ParamsAccordion>
      <WeekendAccordion>
        <ParamsForm disabled={false} setParams={setWeekendDefaults} params={weekendParams} title="Default Weekend" />
      </WeekendAccordion>
      <WeekdayAccordion>
        <ParamsForm disabled={false} setParams={setWeekDayDefaults} params={weekdayParams} title="Default Weekdays" />
      </WeekdayAccordion>
      <GranularDayAccordion paramsList={paramsList} setParamItem={setParamItem} >
      </GranularDayAccordion>
    </div>
  );
}

export default Params