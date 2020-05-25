import React from 'react';
import Button from "../../Button/Button";
import './input.css'
import useUploadData from "../../../hooks/useUploadFiles";

const Input = ({disabled, payload, beginUpload, finishUpload}) => {
  const { uploadData } = useUploadData(payload, beginUpload, finishUpload);

  return (
  <div className="inputFlow" data-testid="input-static">
    <Button
      clickHandler={disabled ? (evt) => evt.preventDefault() : () => {
        uploadData()
      }}
      disabled={disabled}
      name="input"
      classes={['flow']}
      title="Input Static Data"
    />
  </div>
  )
}

export default Input;
