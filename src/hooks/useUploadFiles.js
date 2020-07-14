import React from 'react';
import {HelpContext} from "../context/HelpContext";
import useSendFileToBlob from "./useSendFileToBlob";

export default (payload, beginUpload, finishUpload, saveMessages) => {

  const { setHelpText } = React.useContext(HelpContext)
  const {sendFileToBlob } = useSendFileToBlob()
  const uploadData = async () => {
    setHelpText('Uploading files...');
    beginUpload();
    await sendFileToBlob(payload[0])
    await sendFileToBlob(payload[1])
    finishUpload();
  }

  return {uploadData }

}
