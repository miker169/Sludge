import React from 'react';

export default () => {
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

  const setParams = React.useCallback((evt, value) =>
    dispatch({
      type: 'SET_PARAM',
      payload: { [value]: parseInt(evt.currentTarget.value) },
    }),[]
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

  return { state, beginUpload, finishUpload, beginRunData, modelRan, setParams };
};
