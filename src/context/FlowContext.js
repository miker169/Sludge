import React from "react";

export const FlowContext = React.createContext();

const PARAMS_ERRORS = 'PARAMS_ERRORS';
const RESET = 'RESET';

export const FlowContextProvider = ({children}) => {

  const initialState = {
    inputDisabled: false,
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
    downloadFileName: '',
    params: {
      distanceCalibration: 2,
      driversLiquid: 4,
      driversCake: 1,
      kmperdriverliquid: 250,
      kmperdrivercake: 225,
    },
  };

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case RESET: {
        return initialState;
      }
      case PARAMS_ERRORS:
        return {
          ...state,
          nextArrowDisabled: true,
          inputUpdateArrowDisabled: false,
          updateDisabled: false,
        };

      case 'SET_DOWNLOAD_FILE_NAME':
        return {
          ...state,
          downloadFileName: payload,
        };
      case 'UPLOADING_DATA':
        return {
          ...state,
          inputArrowDisabled: false,
          inputUpdateArrowDisabled: false,
          inputDisabled: true,
        };
      case 'FINISH_UPLOAD':
        return {
          ...state,
          inputArrowRan: true,
          runDisabled: false,
          updateDisabled: false,
          inputUpdateArrowRan: true,
        };
      case "STOP_MODEL":
        return {
          ...state,
          nextArrowDisabled: true,
          inputUpdateArrowDisabled: false,
          updateDisabled: false

        }
      case 'RUNNING_DATA':
        return {
          ...state,
          nextArrowDisabled: false,
          inputUpdateArrowDisabled: true,
          updateDisabled: true,
        };
      case 'RAN_DATA': {
        return {
          ...state,
          fileDownloadUrl: payload,
          nextArrowRan: true,
          runDisabled: true,
          getResultsDisabled: false,
          // helpText: GET_RESULTS_TEXT
        };
      }
      case 'SET_PARAM': {
        return {
          ...state,
          params: {
            ...state.params,
            ...payload,
          },
        };
      }

      default:
        return state;
    }
  };

  const setParams = React.useCallback(
    (evt, value) =>
      dispatch({
        type: 'SET_PARAM',
        payload: { [value]: evt.currentTarget.value },
      }),
    [],
  );

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const beginUpload = React.useCallback(
    () => dispatch({ type: 'UPLOADING_DATA' }),
    [],
  );

  const finishUpload = React.useCallback(
    () => dispatch({ type: 'FINISH_UPLOAD' }),
    [],
  );

  const beginRunData = React.useCallback(
    () => dispatch({ type: 'RUNNING_DATA' }),
    [],
  );

  const modelRan = React.useCallback(
    payload => dispatch({ type: 'RAN_DATA', payload }),
    [],
  );

  const stopModel = React.useCallback(
    () => dispatch({type: 'STOP_MODEL'}),
    []
  )

  const setDownloadFileName = React.useCallback(
    payload => dispatch({ type: 'SET_DOWNLOAD_FILE_NAME', payload }),
    [],
  );

  const resetFlow = React.useCallback(() => {
    return dispatch({ type: RESET });
  }, []);

  const paramErrors = React.useCallback(() => {
    return dispatch({ type: PARAMS_ERRORS });
  }, []);

  return (
    <FlowContext.Provider value={{state, paramErrors, resetFlow, setDownloadFileName, modelRan, beginRunData, beginUpload, finishUpload, setParams, stopModel}}>
      {children}
    </FlowContext.Provider>
  )
}
