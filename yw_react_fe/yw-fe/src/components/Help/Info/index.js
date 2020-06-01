import React from 'react';
import InfoText from '../InfoText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Info = ({ messages, errorText=[] }) => {
  const { warnings = null, errors = null, information = null } = messages ?? {warnings: null, errors: null, information: null};

  return (
    <div data-testid="info-text-component">
      <span data-testid="component-warnings" className="info-help">
        <FontAwesomeIcon className="info-help-icon" icon={faInfoCircle} />
        {!!warnings && warnings.map(w => <InfoText {...w} />)}
        {!!errors && errors.map(e => <InfoText {...e} />)}
        {!!information && information.map(i => <InfoText {...i} />)}
        {errorText.length > 0 && <InfoText messages={errorText} type="Input File Error" />}
      </span>
    </div>
  );
};

export default Info;
