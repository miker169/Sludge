import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from  '@fortawesome/free-solid-svg-icons'
import './fileUpload.css'

const FileInput = () => {

  const ref = React.useRef(null);
  const [label , setLabel] = React.useState('Choose a csv file…');


  const HiddenInput = () => (
    <input accept=".csv, text/csv, application/csv"
           onChange={(e) => {
             //ToDo More robust error handling in case
             // someone decides to bypass the accept.
             if(e.currentTarget.files[0].type.indexOf('csv') !== -1) {
               setLabel(e.currentTarget.files[0].name)
             }
          } }
           data-testid="hidden-input"
           ref={ref}
           type="file"
           name="resume"
           style={{display: 'none'}}
    />
  )
  return (
    <div data-testid="component-file-upload" className="file" onClick={() => ref.current.click()}>
     <HiddenInput />
      <label className="file-label">
          <span className="file-cta">
            <span data-testid="fileLabel" className="file-label">
            {label}
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
