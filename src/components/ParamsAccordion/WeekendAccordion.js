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

const WeekendAccordion = ({ children }) => {

  return (
    <Accordion className="param-accordion" allowMultipleExpanded allowZeroExpanded>
        <AccordionItem className="param-accordion-item">
          <AccordionItemHeading className="param-accordion-heading">
            <AccordionItemButton className="param-accordion-button">
              <span className="param-title-text">Weekend Params</span>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className="param-accordion-panel">
            {children}
          </AccordionItemPanel>
        </AccordionItem>
    </Accordion>
  );
};

export default WeekendAccordion;
