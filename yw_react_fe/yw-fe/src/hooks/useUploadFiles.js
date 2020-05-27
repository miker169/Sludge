import React from 'react';
import axios from "axios";
import {HelpContext} from "../context/HelpContext";

const sendData = process.env.REACT_APP_SEND_JSON;

export default (payload, beginUpload, finishUpload) => {

  const { setHelpText } = React.useContext(HelpContext)
  const uploadData = () => {
    setHelpText('Uploading files...');
    beginUpload();

    const ops = {
      method: 'POST',
      data: JSON.stringify(payload),
      url: sendData,
      headers: { 'content-type': 'application/json' },
    }

    axios(ops).then((res) => {
      finishUpload();
      setHelpText('Finished uploading files, select run model to the data model.')
    }).catch((err) => {
      //ToDo: log this ??
      console.log(err);
    });
  }

  return {uploadData }

}