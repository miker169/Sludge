import React from 'react';
import './UploadedFiles.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";


const UploadedFiles = ({helpText, files}) =>  {
  return (
      <div data-testid="uploaded-files-component">
        <span
          data-testid="component-help-with-files"
          className="file-help">
            <FontAwesomeIcon className="file-help-icon" icon={faInfoCircle}/>
            {helpText}
            <div className="help-fileList">
              {files.map((x, idx) => <span key={idx}>{x}</span>)}
            </div>
        </span>
      </div>
  )
}

export default UploadedFiles;
