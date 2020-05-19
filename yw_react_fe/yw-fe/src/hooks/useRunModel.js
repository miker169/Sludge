import axios from "axios";
import Papaparse from 'papaparse'
import {RAN_DATA_MODEL, SAVE_MESSAGES} from "../context/FlowContext";


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



export default async (dispatch) => {

  const runModelUrl = process.env.REACT_APP_RUN_MODEL_URL;
  const getResultsUrl = process.env.REACT_APP_GET_RESULTS;

  axios.get(runModelUrl, {
    headers: {'Access-Control-Allow-Origin': '*'}
  }).then((data) => {
    dispatch({type: SAVE_MESSAGES, payload: data.data});
    axios.get(getResultsUrl, {
      headers: {'Access-Control-Allow-Origin': '*'}
    }).then((data) => {

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
      objToParse[0] = Object.keys(data.data);
      /*
        This is problem code, until we get the response
        back we don't know how many rows will be returned
        so I have used the length of the name values row.
       */
     let length = Object.keys(data.data["Name"]).length;

     /*
      This awful bit of code is O(n^2) as well..
      We use the length to tell us how many rows
      we need, which is our outer loop. The inner
      loop pulls an item out of each of the returned
      objects which builds up an entire row.
      We need to use i + 1 when setting an item
      as the first row should always be the headers.
      */
     for(let i = 0; i < length; i ++){
       objToParse[i+1] = [];
       for(let item  in data.data){
        objToParse[i +1].push(data.data[item][i]);
       }
     }

      const csv = Papaparse.unparse(objToParse);
      let blob = new Blob([csv], {type: "text/csv"});
      let item = window.URL.createObjectURL(blob);
      dispatch({type: RAN_DATA_MODEL, payload: item});
    });
  });
}
