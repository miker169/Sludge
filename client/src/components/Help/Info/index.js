import React from 'react';
import InfoText from '../InfoText';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

const Info = ({messages, errorText = []}) => {
  const {warnings = null, errors = null, information = null} = messages ?? {
    warnings: null,
    errors: null,
    information: null
  };
  return (
    <div data-testid="info-text-component">
      <span data-testid="component-warnings" className="info-help">
        <FontAwesomeIcon className="info-help-icon" icon={faInfoCircle}/>
        {!!warnings && warnings.map((w, idx) => <InfoText key={idx} {...w} />)}
        {!!errors && errors.map((e, idx) => <InfoText key={idx} {...e} />)}
        {!!information && information.map((i, idx) => <InfoText key={idx} {...i} />)}
        {errorText.length > 0 && <InfoText messages={errorText} type="Input File Error"/>}
      </span>
    </div>
  );
};

export default Info;
