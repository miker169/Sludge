import React from 'react';

export default () => {
  const initialState = {
    files: [],
    payload: null,
    enabled: false,
    messages: null
  };

  const reducer = (state, {type, payload}) => {
    switch (type) {
      case "RESET":
        return {...initialState}
      case "SET_FILES": {
        return {...state, files: [...state.files, payload]}
      }
      case "SET_PAYLOAD":
        return {...state, payload }
      case "SET_ENABLED":
        return {...state, enabled: payload}
      case "SET_MESSAGES":
        return {...state, messages: payload }
      default:
        return state;
    }
  };

  const setFiles = React.useCallback((file) => {
    dispatch({ type: "SET_FILES", payload: file})
  }, [])

  const setPayload = React.useCallback((payload) => {
    dispatch({type: "SET_PAYLOAD", payload})
  }, []);

  const setEnabled = React.useCallback((enabled) => {
    dispatch({type: "SET_ENABLED", payload: enabled})
  }, []);

  const reset = React.useCallback(() => dispatch({type: "RESET"}), []);

  const setMessages = React.useCallback((messages) => dispatch({type: "SET_MESSAGES", payload: messages }), []);

  const [state, dispatch] = React.useReducer(reducer, initialState);

  return {state, setFiles, setPayload, setEnabled, reset, setMessages }
}





