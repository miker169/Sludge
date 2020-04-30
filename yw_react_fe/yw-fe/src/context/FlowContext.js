import useDataContext from "./useDataContext";
import { BlobServiceClient }  from "@azure/storage-blob";
import axios from 'axios';

export const START_FLOW = "START_FLOW";
export const INPUT_DATA = "INPUT_DATA"
export const UPLOADING_DATA = "UPLOADING_DATA";
export const RUN_DATA = "RUN_DATA";
export const SAVE_MESSAGES="SAVE_MESSAGES";
export const RAN_DATA_MODEL = "RAN_DATA_MODEL";
export const REFRESH = "REFRESH"
export const STATIC_DATA_TEXT = `Click Input Static Data to upload: `;
const UPLOAD_CSV_TEXT = 'Click \'Upload CSV\', then select a CSV/Excel file you want to run, from the pop up window.'
const UPLOADING_CSV_TEXT = (fileName) => `Uploading ${fileName}`;
const CHOOSE_RUN_MODEL_TEXT = `Select Run Model to run the model for:`;
const RUNNING_MODEL_TEXT = "Running the Model...";
const GET_RESULTS_TEXT = "Model has ran click Get Results to get the results in a .csv format";
export const SET_FILE = "SET_FILE";
const inputContainer = "data-inputs";
const outputContainer = "data-outputs";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const REACT_APP_BLOB_SAS=process.env.REACT_APP_BLOB_SAS;
const REACT_APP_RUN_MODEL_URL=process.env.REACT_APP_RUN_MODEL_URL;

const initialState = {
  enabled: false,
  helpText: UPLOAD_CSV_TEXT,
  inputDisabled: true,
  updateDisabled: true,
  inputArrowDisabled: true,
  inputArrowRan: false,
  inputUpdateArrowDisabled: true,
  inputUpdateArrowRan: false,
  updateArrowDisabled: true,
  updateArrowRan: false,
  runDisabled: true,
  nextArrowDisabled: true,
  nextArrowRan: false,
  getResultsDisabled: true,
  enableFileUpload: false,
  fileDownloadUrl: 'https://wwmodelling.blob.core.windows.net/data-outputs/pp_test.csv',
  fileInputDisabled: false,
  files: []
};


export const flowReducer = (state, { type, payload }) => {
  switch (type) {
    case REFRESH:
      return initialState
    case SET_FILE:
      return {
        ...state,
        files: [...state.files, payload]
      }
    case START_FLOW:
      return {
        ...state,
        enabled: true,
        inputDisabled: false,
        helpText: STATIC_DATA_TEXT,
        enableFileUpload: false,
        csvFileName: payload
      }
    case UPLOADING_DATA:
      return {
        ...state,
        inputArrowDisabled: false,
        inputUpdateArrowDisabled: false,
        inputDisabled: true,
        helpText: UPLOADING_CSV_TEXT(state.csvFileName)
      }
    case INPUT_DATA:
      return {
        ...state,
        inputArrowRan: true,
        inputDisabled: true,
        runDisabled: false,
        updateDisabled: false,
        fileInputDisabled: true,
        inputUpdateArrowRan: true,
        enableFileUpload: true,
        helpText: CHOOSE_RUN_MODEL_TEXT
      }
    case RUN_DATA:
      return {
        ...state,
        nextArrowDisabled: false,
        inputUpdateArrowDisabled: true,
        updateDisabled: true,
        helpText: RUNNING_MODEL_TEXT
      }
    case RAN_DATA_MODEL:{
      return {...state, fileDownloadUrl: payload, nextArrowRan: true, runDisabled: true, getResultsDisabled: false,
      helpText: GET_RESULTS_TEXT
      }
    }
    case SAVE_MESSAGES:
      return {...state, messages: payload}
    default:
      return state;
  }
}


export const start = (dispatch) => (fileName) => {
  dispatch({type: START_FLOW, payload: fileName});
}
export const inputData = (dispatch) => () =>{
  dispatch({type: INPUT_DATA});
}

export const uploadFile = async (files) => {
  const blobServiceClient = new BlobServiceClient(REACT_APP_BLOB_SAS);
  const containerClient = blobServiceClient.getContainerClient(inputContainer);

  try {
    const promises = [];
    [...files].forEach(file => {
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      promises.push(blockBlobClient.uploadBrowserData(file));
    })
    return await Promise.all(promises);
  } catch (e) {
    console.log(e.message)
  }
}

export const refresh = (dispatch) => () => {
  dispatch({type: REFRESH})
}

export const uploadData = (dispatch) => (file) =>{
  dispatch({type: UPLOADING_DATA});
  uploadFile(file).then((data) => {
    dispatch({type: INPUT_DATA});
  });
}
export const runData = (dispatch) => async () => {
  dispatch({type: RUN_DATA});

  axios.get(REACT_APP_RUN_MODEL_URL, {
    headers: {'Access-Control-Allow-Origin': '*'}
  }).then(data => {
    dispatch({type: SAVE_MESSAGES, payload: data.data})
    const blobServiceClient = new BlobServiceClient(REACT_APP_BLOB_SAS);
    const containerClient = blobServiceClient.getContainerClient(outputContainer);
    const blockBlobClient = containerClient.getBlobClient("pp_test.csv");
    return blockBlobClient.download()})
    .then((blob) => blob.blobBody)
    .then(body => body.text()).then(data => {
      let blob = new Blob([data], {type: "text/csv"});
      let item = window.URL.createObjectURL(blob);
      dispatch({type: RAN_DATA_MODEL, payload: item});
  });
}

export const setFile = (dispatch) => (file) => {
  dispatch({type: SET_FILE, payload: file[0]});
}

export const { Provider, Context } =
  useDataContext(flowReducer, { start, inputData, uploadData, runData, setFile, refresh }, initialState);

