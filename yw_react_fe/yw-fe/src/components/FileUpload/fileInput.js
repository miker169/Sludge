import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faCaretDown } from  '@fortawesome/free-solid-svg-icons'
import './fileUpload.css'
import { Context as FlowContext } from "../../context/FlowContext";

const FileInput = () => {

  const ref = React.useRef(null);
  const [label , setLabel] = React.useState('Upload CSV');
  const {start} = React.useContext(FlowContext);


  const HiddenInput = () => (
    <input accept=".csv, text/csv, application/csv. xsl, .xslx"
           onChange={(e) => {
             if(e.currentTarget.files[0].type.indexOf('csv') !== -1) {
               setLabel(e.currentTarget.files[0].name);
               start(e.currentTarget.files[0].name)
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
         {/* <span className="file-icon">*/}
         {/*   <FontAwesomeIcon icon={faFolderOpen} />*/}
         {/*</span>*/}
          <span className="file-cta">
            <span data-testid="fileLabel" className="file-label">
              {label}
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
