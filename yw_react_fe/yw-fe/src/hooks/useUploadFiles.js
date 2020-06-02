import React from 'react';
import axios from "axios";
import {HelpContext} from "../context/HelpContext";

const sendData = process.env.REACT_APP_SEND_JSON;

export default (payload, beginUpload, finishUpload, saveMessages) => {

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
      debugger;
      finishUpload();
      setHelpText('Finished uploading files, select run model to the data model.')
    }).catch((err) => {
      saveMessages(err.response.data);
      finishUpload();
    });
  }

  return {uploadData }

}
