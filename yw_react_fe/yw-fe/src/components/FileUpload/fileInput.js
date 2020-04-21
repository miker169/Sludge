import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from  '@fortawesome/free-solid-svg-icons'
import './fileUpload.css'

const FileInput = () => {

  const ref = React.useRef(null);

  const HiddenInput = () => (
    <input ref={ref} type="file" name="resume" style={{display: 'none'}}/>
  )
  return (
    <div data-testid="component-file-upload" className="file" onClick={() => ref.current.click()}>
     <HiddenInput />
      <label className="file-label">
          <span className="file-cta">
            <span className="file-label">
            Choose a file…
          </span>
            <span className="file-icon">
               <FontAwesomeIcon icon={faFileCsv} />
            </span>
          </span>
      </label>
    </div>
  )
}

export default FileInput;
