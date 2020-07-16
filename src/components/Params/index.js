import React from 'react'
import ParamsForm from "../FlowContainer/ParamsForm";
import GranularDayAccordion from "../ParamsAccordion/GranularDayAccordion";
import WeekendAccordion from '../ParamsAccordion/WeekendAccordion'
import WeekdayAccordion from "../ParamsAccordion/WeekdayAccordion";
import ParamsAccordion from '../ParamsAccordion'
import {ParamsContext} from "../../context/ParamsContext";


const Params = () => {
  const { params, weekdayParams,weekendParams, paramsList, setDefaultParams, setWeekendDefaults, setWeekDayDefaults, setParamItem} = React.useContext(ParamsContext);


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
