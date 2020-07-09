import React from 'react';
import './paramsAcccordion.css'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from 'react-accessible-accordion';

const ParamsAccordion = ({children}) =>
  (
    <Accordion className="param-accordion" allowMultipleExpanded allowZeroExpanded>
        <AccordionItem className="param-accordion-item">
          <AccordionItemHeading className="param-accordion-heading">
            <AccordionItemButton className="param-accordion-button">
              <span className="param-title-text">All Params</span>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className="param-accordion-panel">
            {children}
          </AccordionItemPanel>
        </AccordionItem>
    </Accordion>
  );

export default ParamsAccordion;
