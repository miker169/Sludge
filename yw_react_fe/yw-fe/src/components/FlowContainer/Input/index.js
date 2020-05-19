import React from 'react';
import Button from "../../Button/Button";
import {Context as FlowContext } from "../../../context/FlowContext";
import {Context as FileContext } from "../../../context/FileContext";
import './input.css'
import useUploadData from "../../../hooks/useUploadData";

const Input = () => {
  const {state } = React.useContext(FlowContext);
  const { toggleUpload } = React.useContext(FileContext);
  useUploadData();


  return (
  <div className="inputFlow" data-testid="input-static">
    <Button
      clickHandler={state.inputDisabled ? (evt) => evt.preventDefault() : () => {
        toggleUpload();
      }}
      disabled={state.inputDisabled}
      name="input"
      classes={['flow']}
      title="Input Static Datas"
    />
  </div>
  )
}

export default Input;
