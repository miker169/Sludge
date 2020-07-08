import axios from 'axios';
import Papa from 'papaparse'
import moment from "moment";
import React from "react";
import {ParamsContext} from "../context/ParamsContext";


export default () => {

  // get date from file
  // save it for params to use
  const { setParamsStartDate } = React.useContext(ParamsContext)

  const sendFileToBlob = loadedFile => {
    debugger;
    if(loadedFile.name.includes('.csv')){
      Papa.parse(loadedFile, {
        complete: (csv) => {
          let date = csv.data[1][10]
          let startDate = moment(new Date(date))
          setParamsStartDate(startDate)
        }
      });
    }

    debugger;
    const data = new FormData();
    data.append('file', loadedFile)
    axios.post('/file-upload', data)
      .then(res => {
        console.log(res.statusText)
      })
  };

  return {sendFileToBlob};
};
