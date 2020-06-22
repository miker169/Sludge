import React from 'react';
import {HelpContext} from "../context/HelpContext";
import useSendFileToBlob from "./useSendFileToBlob";

export default (payload, beginUpload, finishUpload, saveMessages) => {

  const { setHelpText } = React.useContext(HelpContext)
  const {sendFileToBlob } = useSendFileToBlob()
  const uploadData = () => {
    setHelpText('Uploading files...');
    beginUpload();
    payload.forEach(file => {
      sendFileToBlob(file)
    })
    finishUpload();
  }

  return {uploadData }

}
