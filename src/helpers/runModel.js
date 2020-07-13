import axios from 'axios';
import React from 'react';
import moment from 'moment';
import {ParamsContext} from "../context/ParamsContext";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export const runModel = async (saveMessages, modelRan, setHelpText, params, setDownloadFileName, paramErrors, downloadFileName, startDate, paramsList) => {
 setHelpText('Running data model...');
    const enumerateDaysBetweenDates = (startDate, endDate) => {
      let dates = [];
      dates.push(startDate.clone().format('DD/MM/YYYY'));

      let currDate = moment(startDate).startOf('day');
      let lastDate = moment(endDate).startOf('day');

      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        console.log(currDate.toDate());
        dates.push(currDate.clone().format('DD/MM/YYYY'));
      }

      dates.push(endDate.clone().format('DD/MM/YYYY'));

      return dates;
    };

    let endDate = startDate.clone().add(13, 'days');
    let dates = enumerateDaysBetweenDates(startDate, endDate);

    if(Object.keys(paramsList).length == 0){
      dates.forEach((date) => {
        paramsList[date] = params
      })
    }


    try {
      const res = await axios({
        method: 'post',
        url: '/run-model',
        data: JSON.stringify(paramsList),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const {errors, filename} = res.data;
      if (errors) {
        saveMessages(errors);
      } else {
        console.log('We have had a response ', filename)
        setDownloadFileName(filename)

        const blobResponse = await fetch('/latest-output', {
          method: 'post',
          body: JSON.stringify({'filename': filename}),
          headers: {'Content-Type': 'application/json'}
        })
        const body = await blobResponse.blob();
        let item = window.URL.createObjectURL(body);
        modelRan(item)

      }
    }catch(ex){
      console.log(JSON.stringify(ex,null,2))
    }
};
