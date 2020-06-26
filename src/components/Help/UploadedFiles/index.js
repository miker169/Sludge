import React from 'react';
import './UploadedFiles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { HelpContext } from "../../../context/HelpContext";

const UploadedFiles = ({ files = [] }) => {

  const {helpText} = React.useContext(HelpContext);

  const renderHelp = () => {

    const hasReferenceFile =  files.find(x => x.name.split('.').pop() === 'xlsx');
    const hasProductionFile =  files.find(x => x.name.split('.').pop() === 'csv')

    return(
      <div className="file-list">
        {!!hasReferenceFile
          ? <div className="file-item"><span className="helper-text">Reference File</span><div className="help-checkbox"/></div>
          : <div className="file-item"><span className="helper-text">Reference File</span><div className="help-checkbox-none"/></div>
        }
        {!!hasProductionFile
          ? <div className="file-item"><span className="helper-text">Production File</span><div className="help-checkbox"/></div>
          : <div className="file-item"><span className="helper-text">Production File</span><div className="help-checkbox-none"/></div>
        }
    </div>);
    }

    return (
      <div data-testid="uploaded-files-component">
        <span data-testid="component-help-with-files" className="file-help">
          <FontAwesomeIcon className="file-help-icon" icon={faInfoCircle} />
          <React.Fragment>
            {helpText}
            {renderHelp()}
          </React.Fragment>
        </span>
      </div>
    );
};

export default UploadedFiles;
