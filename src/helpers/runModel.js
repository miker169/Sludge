import axios from 'axios';
import Papaparse from 'papaparse';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const runModelUrl = process.env.REACT_APP_RUN_MODEL_URL;
const getResultsUrl = process.env.REACT_APP_GET_RESULTS;

export const runModel = async (saveMessages, modelRan, setHelpText, params, setDownloadFileName, paramErrors) => {
  setHelpText('Running data model...');
  if (!validParams(params)) {
    paramErrors();
    return saveMessages({errors: [{type: 'Params',
        messages:['Before model can be ran, you must fix all errors with the model params.']
    }]}
    )
  }else {
    axios
    .post(
      'http://localhost:5000/run_model',
      {params: params},
      {
        headers: {'Access-Control-Allow-Origin': '*'},
      },
    )
    .then((payload) => {
      const {errors, data} = payload;
      if (errors) {
        saveMessages(errors);
      } else {
        saveMessages(data);

        axios
        .get(getResultsUrl, {
          headers: {'Access-Control-Allow-Origin': '*'},
        })
        .then(({data}) => {
          if (data?.filename) {
            setDownloadFileName(data?.filename)
          }
          const csv = ParseJsonToCsV(data);
          buildCsvFile(csv, modelRan);
          setHelpText(
            'Model Ran select Get Results to download the csv results',
          );
        }).catch(err => {
          console.log(err)
        });
      }
    }).catch(err => {
      saveMessages(err.response.data);
      modelRan();
      console.log(err);
    });
  }

};

const validParams = (params) => {
  let newParams = new Map();
  let hasError = false;
  for(let param in params){
    if (typeof params[param] !== "number") {
      if (isNaN(parseFloat(params[param]))) {
        hasError = true;
      } else if (parseFloat(params[param]) <= 0) {
        hasError = true;
      } else {
        newParams.set(param, parseFloat(params[param]))
      }
    } else {
      newParams.set(param, params[param])
    }
  }
  return hasError ?  false :  newParams
}

const buildCsvFile = (csv, modelRan) => {
  let blob = new Blob([csv], {type: 'text/csv'});
  let item = window.URL.createObjectURL(blob);

  modelRan(item);
};

const ParseJsonToCsV = ({data}) => {
  /*
        Probably best to ignore whats happening here
        basically we get returned a json object of objects, the csv
        parser expects an array of arrays, this bit of trickery
        turns the whole object on its head and converts it to an
        array of arrays.
       */
  let objToParse = [];
  // first row always has to be the headers, in the
  // case of what's returned this is all the property
  // keys
  objToParse[0] = Object.keys(data);
  /*
    This is problem code, until we get the response
    back we don't know how many rows will be returned
    so I have used the length of the name values row.
   */
  let length = Object.keys(data['from']).length;

  /*
   This awful bit of code is O(n^2) as well..
   We use the length to tell us how many rows
   we need, which is our outer loop. The inner
   loop pulls an item out of each of the returned
   objects which builds up an entire row.
   We need to use i + 1 when setting an item
   as the first row should always be the headers.
   */
  for (let i = 0; i < length; i++) {
    objToParse[i + 1] = [];
    for (let item in data) {
      objToParse[i + 1].push(data[item][i]);
    }
  }

  return Papaparse.unparse(objToParse);
};
