import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export const runModel = (setErrorText, modelRan, setHelpText, setDownloadFileName, paramsList, stopModel) => {
  setHelpText('Running data model...');

  console.log('1. ABOUT TO BUILD PARAMS')

  for (let key in paramsList) {
    let params = {...paramsList[key]};
    for (let p in params) {
      if (typeof params[p] === 'string' || params[p] instanceof String) {
        //convert to float
        let newVal = parseFloat(params[p])
        params = {...params, [p]: newVal}
      }
    }
    paramsList[key] = params;
  }

  console.log(paramsList);

  console.log('2. About to run model')

  try {
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => {
      console.log('Hit timeout')
      setErrorText([{error: 'Communication with server timed out.', type: 'server'}])
      stopModel();
      controller.abort()
    }, 450000);

    fetch('/run-model', {
      method: 'post',
      body: JSON.stringify(paramsList),
      signal,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((res) => {
      if (!res.ok) {
        throw res
      }

      console.log('3. Model responded with JSON')
      return res.json();
    })
    .then(res => {
      console.log('4. Desatructing response')
      const {errors, filename, message} = res;
      console.log(JSON.stringify(res), null, 2)
      if (message) {
        console.log('Setting error text from message and stopping model')
        setErrorText([{error: 'There was a network problem', type: 'server'}])
        stopModel();
      }
      if (errors) {
        console.log('Setting error text from message and stopping model arrow')
        setErrorText(errors);

        if (!!filename) {
          console.log('We have a file name, about set it, then fetch blob')
          setDownloadFileName(filename)
          fetch('/latest-output', {
            method: 'post',
            body: JSON.stringify({'filename': filename}),
            headers: {'Content-Type': 'application/json'}
          }).then((blobResponse) => {
            console.log('BlobRespnse Returned.')
            return blobResponse.blob()
          }).then(body => {
            console.log('Getting blob body and setting the file to be downloaded')
            let item = window.URL.createObjectURL(body);
            modelRan(item)
          }).catch(ex => {
            console.log('Error getting latest output', JSON.stringify(ex, null, 2))
            const error = 'Error getting latest output when there is a filename';
            ex.customError = error
            fetch('/logging', {
              method: 'post',
              body: JSON.stringify(ex, null, 2),
              headers: {'Content-Type': 'application/json'}
            }).then(msg => {
              console.log('Succesfully post log and about to stop model arrow')
              stopModel();
            }).catch(ex => {
              console.log('Error saving error log', JSON.stringify(ex, null, 2));
              stopModel()
            })
          })
        } else {
          console.log('Theres no filename so about tostop the model run arrrow')
          stopModel();
        }
      } else {
        console.log('No errors about to save the file name')
        setDownloadFileName(filename)
        fetch('/latest-output', {
          method: 'post',
          body: JSON.stringify({'filename': filename}),
          headers: {'Content-Type': 'application/json'}
        }).then((blobResponse) => {
          console.log('No errors and fetching blob response')
          return blobResponse.blob()
        }).then(body => {
          console.log('Saving blob to be downloaded')
          let item = window.URL.createObjectURL(body);
          console.log('Setting model ran')
          modelRan(item)
        }).catch(ex => {
          console.log('No initial errors, however errors after getting blob file', JSON.stringify(ex, null, 2))
          const error = 'Error getting latest output when there is no filename';
          ex.customError = error
          fetch('/logging', {
            method: 'post',
            body: JSON.stringify(ex, null, 2),
            headers: {'Content-Type': 'application/json'}
          }).then(() => {
            console.log('Succesfully posted log error')
            stopModel();
          }).catch(ex => {
            console.log('Error writing to logs')
            stopModel();
          })
        })
      }
    }).catch(ex => {
      console.log(ex);
      //console.log(JSON.stringify(ex, null, 2));

      console.log('Error after calling run model', JSON.stringify(ex, null, 2))
      const error = 'Error in final catch block';
      ex.customError = error + ' '+ex;
      fetch('/logging', {
        method: 'post',
        body: JSON.stringify(ex, null, 2),
        headers: {'Content-Type': 'application/json'}
      }).then(msg => {
        console.log('Succesfully saved log and about to call stopModel')
        stopModel();
      }).catch(ex => {
        console.log('There was an error logging the error', JSON.stringify(ex, null, 2))
        setErrorText([{error: 'There was a network problem', type: 'server'}])
        stopModel();
      })

    });
  } catch (ex) {
    console.log('Error caught')
    console.log(JSON.stringify(ex, null, 2))
    fetch('/logging', {
      method: 'post',
      body: JSON.stringify(ex, null, 2),
      headers: {'Content-Type': 'application/json'}
    }).then(msg => {
      console.log('Succesfully saved log and about to call stopModel')
      stopModel();
    }).catch(ex => {
      stopModel();
    })
  }
};
