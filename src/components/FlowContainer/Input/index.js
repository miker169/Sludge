import React from 'react';
import Button from "../../Button/Button";
import './input.css'
import useUploadData from "../../../hooks/useUploadFiles";
import {FlowContext} from "../../../context/FlowContext";
import {FileContext} from "../../../context/FileContext";

const Input = ({saveMessages}) => {
  const { files } = React.useContext(FileContext)
  const { finishUpload, beginUpload, state} = React.useContext(FlowContext)
  const { uploadData } = useUploadData(files, beginUpload, finishUpload, saveMessages);

  return (
  <div className="inputFlow" data-testid="input-static">
    <Button
      clickHandler={state.inputDisabled ? (evt) => evt.preventDefault() : () => {
        uploadData()
      }}
      disabled={state.inputDisabled}
      name="input"
      classes={['flow']}
      title="Input Static Data"
    />
  </div>
  )
}

export default Input;
