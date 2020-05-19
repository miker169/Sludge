import React, {useEffect} from 'react';
import { Context as FileContext } from '../context/FileContext';
import {Context as FlowContext } from '../context/FlowContext';
import axios from "axios";

const sendData = process.env.REACT_APP_SEND_JSON;

export default () => {
  const {state: { productionInput, referenceInput, paramsInput, upload}, toggleUpload} = React.useContext(FileContext);
  const {finishUploadingData, uploadData } = React.useContext(FlowContext);

  const payload = {
    productionInput,
    referenceInput,
    paramsInput
  }

  const fileStateValid = productionInput !== undefined
    && referenceInput !== undefined;

  useEffect( () => {
    if(upload && fileStateValid){
      uploadData()
      axios.post(sendData, payload,{
        headers: {'Access-Control-Allow-Origin': '*'},
      }).then(data => {
        finishUploadingData()
        toggleUpload();
      });
    }
  }, [upload, fileStateValid])
}
