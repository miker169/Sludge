import axios from 'axios';
import Papa from 'papaparse'
import moment from "moment";
import React from "react";
import {ParamsContext} from "../context/ParamsContext";


export default () => {

  // get date from file
  // save it for params to use
  const { setParamsStartDateHook } = React.useContext(ParamsContext)

  const sendFileToBlob = loadedFile => {
    if(loadedFile.name.includes('.csv')){
      Papa.parse(loadedFile, {
        complete: (csv) => {
          const date = csv.data[1][5]
          const startDate = new Date(date.split('/')[2], date.split('/')[1] - 1, date.split('/')[0]);
          setParamsStartDateHook(moment(startDate))
        }
      });
    }

    const data = new FormData();
    data.append('file', loadedFile)
    axios.post('/file-upload', data)
      .then(res => {
        console.log(res.statusText)
      })
  };

  return {sendFileToBlob};
};
