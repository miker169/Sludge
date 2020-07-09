import React from 'react';
import './paramsAcccordion.css'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from 'react-accessible-accordion';

const WeekdayAccordion = ({ children }) => {

  return (
    <Accordion className="param-accordion" allowMultipleExpanded allowZeroExpanded>
        <AccordionItem className="param-accordion-item">
          <AccordionItemHeading className="param-accordion-heading">
            <AccordionItemButton className="param-accordion-button">
              <span className="param-title-text"> Weekday</span>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className="param-accordion-panel">
            {children}
          </AccordionItemPanel>
        </AccordionItem>
    </Accordion>
  );
};

export default WeekdayAccordion;
