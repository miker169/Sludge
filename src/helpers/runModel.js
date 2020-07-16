import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export const runModel = (setErrorText, modelRan, setHelpText, setDownloadFileName, paramsList, stopModel) => {
  setHelpText('Running data model...');


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
    const {errors, filename, message} = res;
    console.log(JSON.stringify(res), null, 2)
    if(message){
      setErrorText([{error: 'There was a network problem', type:'server'}])
      stopModel();
    }
    if (errors) {
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

    setErrorText([{error: 'There was a network problem', type:'server'}])
    stopModel();
  });

};
