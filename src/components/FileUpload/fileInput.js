import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from  '@fortawesome/free-solid-svg-icons'
import './fileUpload.css'

const FileInput = ({setFiles,files}) => {

  const ref = React.useRef(null);

  const HiddenInput = () => (
    <input accept=".csv, text/csv, application/csv. xsl, .xlsx"
           onChange={(e) => {
             setFiles(e.target.files[0])
          } }
           data-testid="hidden-input"
           ref={ref}
           type="file"
           name="resume"
           style={{display: 'none'}}
    />
  )
  return (
    <div data-testid="component-file-upload" className="file" onClick={() => {
      ref.current.click()
    }}>
     <HiddenInput />

      <label className="file-label">
          <span className="file-cta">
            <span data-testid="fileLabel" className="file-label">
             Upload CSV
            </span>
          </span>
          <span className="down-icon">
            <FontAwesomeIcon size={"2x"} icon={faCaretDown} />
         </span>
      </label>
    </div>
  )
}

export default FileInput;