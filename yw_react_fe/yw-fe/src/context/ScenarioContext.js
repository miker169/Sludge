import useDataContext from "./useDataContext";
import scenarios from './scenario';
export const SHOW_SCENARIOS = "SHOW_SCENARIOS";
export const scenarioReducer = (state, {type, payload}) => {
  switch (type) {
    case SHOW_SCENARIOS:
      return {...state, scenarioOptions: payload, displayOptions: true }
    default:
      return state;
  }
}

export const showScenarios = (dispatch) => () => {
  dispatch({type: SHOW_SCENARIOS, payload: scenarios})
}

export const next =(dispatch) => (option) => {
  if(option.items.length > 0) {

  }
}


export const { Provider, Context } =
  useDataContext(scenarioReducer, { showScenarios  }, {
    scenarioOptions: scenarios,
  });
