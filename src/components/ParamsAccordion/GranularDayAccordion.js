import React from 'react';
import moment from 'moment';
import './paramsAcccordion.css'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from 'react-accessible-accordion';
import ParamsForm from "../FlowContainer/ParamsForm";

const GranualarParamsAccordiong = ({ paramsList, setParamItem }) => {
  debugger;
  // get the next 14 dates

 const dates = Object.keys(paramsList)


  return (
    <Accordion className="param-accordion" allowMultipleExpanded allowZeroExpanded>
      {dates.map((date, idx) =>
        <AccordionItem className="param-accordion-item">
          <AccordionItemHeading className="param-accordion-heading">
            <AccordionItemButton className="param-accordion-button">
              <span className="param-title-text">{date}</span>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className="param-accordion-panel">
            <ParamsForm setParams={(value, name) => setParamItem(value, name ,date)} disabled={false}  params={paramsList[date]} title="Days"  />
          </AccordionItemPanel>
        </AccordionItem>,
      )}
    </Accordion>
  );
};

export default GranualarParamsAccordiong;
