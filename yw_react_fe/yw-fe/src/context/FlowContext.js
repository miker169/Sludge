import useDataContext from "./useDataContext";


export const START_FLOW = "START_FLOW";
export const INPUT_DATA = "INPUT_DATA"
export const UPLOADING_DATA = "UPLOADING_DATA";
export const RUN_DATA = "RUN_DATA";
export const RAN_DATA_MODEL = "RAN_DATA_MODEL";
export const START_UPDATE_DATA = "START_UPDATE_DATA"
export const DATA_UPDATED = "DATA_UPDATED";
export const STATIC_DATA_TEXT = (fileName) =>  `Click Input Static Data to upload ${fileName}`
const UPLOAD_CSV_TEXT = 'Click \'Upload CSV\', then select a CSV/Excel file you want to run, from the pop up window.'
const UPLOADING_CSV_TEXT = (fileName) => `Uploading ${fileName}`;
const CHOOSE_RUN_MODEL_TEXT = (fileName) =>  `Select Run Model to run the model for ${fileName}`;
const RUNNING_MODEL_TEXT = "Running the Model...";
const GET_RESULTS_TEXT = "Model has ran click Get Results to get the results in a .csv format";


export const flowReducer = (state, { type, payload }) => {
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


export const start = (dispatch) => (fileName) => {
  dispatch({type: START_FLOW, payload: fileName});
}
export const inputData = (dispatch) => () =>{
  dispatch({type: INPUT_DATA});
}

export const uploadData = (dispatch) => () =>{
  dispatch({type: UPLOADING_DATA});
  setTimeout(() => {
    dispatch({type: INPUT_DATA});
  }, 3000)

}
export const runData = (dispatch) => () => {
  dispatch({type: RUN_DATA});
  setTimeout(() => {
    dispatch({type: RAN_DATA_MODEL});
  }, 3000)
}

export const { Provider, Context } =
  useDataContext(flowReducer, { start, inputData, uploadData, runData }, {
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

