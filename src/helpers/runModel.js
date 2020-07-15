import axios from 'axios';
import React from 'react';
import moment from 'moment';
import {ParamsContext} from "../context/ParamsContext";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export const runModel = (setErrorText, modelRan, setHelpText, params, setDownloadFileName, paramErrors, downloadFileName, startDate, paramsList, stopModel) => {
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

  if (Object.keys(paramsList).length == 0) {
    dates.forEach((date) => {
      paramsList[date] = params
    })
  }

  for (let key in paramsList) {
    const params = paramsList[key];
    for (let p in params) {
      if (typeof params[p] === 'string' || params[p] instanceof String) {
        //convert to float
        params[p] = parseFloat(params[p])
      }
    }
  }

  fetch('/run-model', {
    method: 'post',
    body: JSON.stringify(paramsList),
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then((res) => {
    return res.json();
  })
  .then(res => {
    console.log(JSON.stringify(res, null, 2));
    const {errors, filename} = res;
    if (errors) {

      console.log('We have errors');
      setErrorText(errors);
      if (!!filename) {
        setDownloadFileName(filename)
        fetch('/latest-output', {
          method: 'post',
          body: JSON.stringify({'filename': filename}),
          headers: {'Content-Type': 'application/json'}
        }).then((blobResponse) => {
          return blobResponse.blob()
        }).then(body => {
          let item = window.URL.createObjectURL(body);
          modelRan(item)
        })
      } else {
        stopModel();
      }
    } else {
      console.log('We have had a response ', filename)
      setDownloadFileName(filename)
      fetch('/latest-output', {
        method: 'post',
        body: JSON.stringify({'filename': filename}),
        headers: {'Content-Type': 'application/json'}
      }).then((blobResponse) => {
        return blobResponse.blob()
      }).then(body => {
        let item = window.URL.createObjectURL(body);
        modelRan(item)
      })
    }
  }).catch(ex => {
    stopModel();
    console.log('IN Catch')
    console.log(JSON.stringify(ex, null, 2))
  });

};
