import React from 'react';
import axios from "axios";
import {HelpContext} from "../context/HelpContext";

const sendData = process.env.REACT_APP_SEND_JSON;

export default (payload, beginUpload, finishUpload) => {

  const { setHelpText } = React.useContext(HelpContext)
  const uploadData = () => {
    setHelpText('Uploading files...');
    beginUpload();
    axios.post(sendData, payload,{
      headers: {'Access-Control-Allow-Origin': '*'},
    }).then(() => {
      finishUpload();
      setHelpText('Finished uploading files, select run model to the data model.')
    });
  }

  return {uploadData }

}
