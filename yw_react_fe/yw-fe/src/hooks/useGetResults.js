import axios from "axios";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



export default async (dispatch) => {

  const getResultsUrl = process.env.REACT_GET_RESULTS;

  axios.get(getResultsUrl, {
    headers: {'Access-Control-Allow-Origin': '*'}
  }).then((data) => {
  });
}
