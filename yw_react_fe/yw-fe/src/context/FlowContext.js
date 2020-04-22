import useDataContext from "./useDataContext";


const START_FLOW = "START_FLOW";
const INPUT_DATA = "INPUT_DATA"
const UPLOADING_DATA = "UPLOADING_DATA";
const RUN_DATA = "RUN_DATA";
const RAN_DATA_MODEL = "RAN_DATA_MODEL";
const START_UPDATE_DATA = "START_UPDATE_DATA"
const DATA_UPDATED = "DATA_UPDATED";

const flowReducer = (state, { type, payload }) => {
  switch (type) {
    case START_FLOW:
      return {...state, enabled: true, inputDisabled: false}
    case UPLOADING_DATA:
      return {
        ...state,
        inputArrowDisabled: false,
        inputUpdateArrowDisabled: false,
        inputDisabled: true}
    case INPUT_DATA:
      return {
        ...state,
        inputArrowRan: true,
        inputDisabled: true,
        runDisabled: false,
        updateDisabled: false,
        inputUpdateArrowRan: true
      }
    case START_UPDATE_DATA:
      return {...state, updateArrowDisabled: false, inputArrowDisabled: true, updateDisabled: true}
    case DATA_UPDATED:
      return {...state, updateArrowRan: true}
    case RUN_DATA:
      return {...state, nextArrowDisabled: false, updateDisabled: true}
    case RAN_DATA_MODEL:{
      return {...state, nextArrowRan: true, runDisabled: true, getResultsDisabled: false }
    }
    default:
      return state;
  }
}


const start = (dispatch) => () => dispatch({type: START_FLOW});
const inputData = (dispatch) => () => dispatch({type: INPUT_DATA});
const uploadData = (dispatch) => () =>{
  dispatch({type: UPLOADING_DATA});
  setTimeout(() => {
    dispatch({type: INPUT_DATA});
  }, 1000)

}
const runData = (dispatch) => () => {
  dispatch({type: RUN_DATA});
  setTimeout(() => {
    dispatch({type: RAN_DATA_MODEL});
  }, 1000)
}

const updateData = (dispatch) => () => {
  dispatch({type: START_UPDATE_DATA})
  setTimeout(() => {
    dispatch({type: DATA_UPDATED});
  },1000);
}

export const { Provider, Context } =
  useDataContext(flowReducer, { start, inputData, uploadData, runData, updateData }, {
    enabled: false,
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
    getResultsDisabled: true
  });

