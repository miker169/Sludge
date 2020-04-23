import useDataContext from "./useDataContext";


const START_FLOW = "START_FLOW";
const INPUT_DATA = "INPUT_DATA"
const UPLOADING_DATA = "UPLOADING_DATA";
const RUN_DATA = "RUN_DATA";
const RAN_DATA_MODEL = "RAN_DATA_MODEL";
const START_UPDATE_DATA = "START_UPDATE_DATA"
const DATA_UPDATED = "DATA_UPDATED";
const STATIC_DATA_TEXT = (fileName) =>  `Click Input Static Data to upload ${fileName}`
const UPLOAD_CSV_TEXT = 'Click \'Upload CSV\', then select a CSV/Excel file you want to run, from the pop up window.'
const UPLOADING_CSV_TEXT = (fileName) => `Uploading ${fileName}`;
// const UPDATE_RUN_CHOICE_TEXT = 'Select Run Model to run the model or Update Static Data to update the csv';
const CHOOSE_RUN_MODEL_TEXT = (fileName) =>  `Select Run Model to run the model for ${fileName}`;
const RUNNING_MODEL_TEXT = "Running the Model...";
const GET_RESULTS_TEXT = "Model has ran click Get Results to get the results in a .csv format";


const flowReducer = (state, { type, payload }) => {
  switch (type) {
    case START_FLOW:
      return {
        ...state,
        enabled: true,
        inputDisabled: false,
        helpText: STATIC_DATA_TEXT(payload),
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
        inputUpdateArrowRan: true,
        enableFileUpload: true,
        helpText: CHOOSE_RUN_MODEL_TEXT(state.csvFileName)
      }
    case START_UPDATE_DATA:
      return {
        ...state,
        updateArrowDisabled: false,
        inputArrowDisabled: true,
        updateDisabled: true,
        enableFileUpload: false,
        helpText: UPLOADING_CSV_TEXT(state.csvFileName)
      }
    case DATA_UPDATED:
      return {
        ...state,
        updateArrowRan: true,
        helpText: CHOOSE_RUN_MODEL_TEXT,
        enableFileUpload: false,
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
      return {...state, nextArrowRan: true, runDisabled: true, getResultsDisabled: false,
      helpText: GET_RESULTS_TEXT}
    }
    default:
      return state;
  }
}


const start = (dispatch) => (fileName) => dispatch({type: START_FLOW, payload: fileName});
const inputData = (dispatch) => () => dispatch({type: INPUT_DATA});
const uploadData = (dispatch) => () =>{
  dispatch({type: UPLOADING_DATA});
  setTimeout(() => {
    dispatch({type: INPUT_DATA});
  }, 3000)

}
const runData = (dispatch) => () => {
  dispatch({type: RUN_DATA});
  setTimeout(() => {
    dispatch({type: RAN_DATA_MODEL});
  }, 3000)
}

const updateData = (dispatch) => () => {
  dispatch({type: START_UPDATE_DATA})
  setTimeout(() => {
    dispatch({type: DATA_UPDATED});
  },3000);
}

export const { Provider, Context } =
  useDataContext(flowReducer, { start, inputData, uploadData, runData, updateData }, {
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
    enableFileUpload: true,
  });

