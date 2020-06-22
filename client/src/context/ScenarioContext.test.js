import scenarios from './scenario';

import {
  scenarioReducer,
  showScenarios,
  SHOW_SCENARIOS } from './ScenarioContext';

describe('Scenario Context', () => {
  let buildDataMock = (data) => {

  }
  describe('ScenarioReducer', () => {
    let state = {};
    test('Returns a default state', () => {
      state.testData = 'hello';
      let newState = scenarioReducer(state, {type: 'Test_Action'});
      expect(newState.testData).toBe('hello');
    });
    describe('When Type is SHOW_SCENARIOS', () => {

      test("Adds scenarioOptions to the state", () => {
        state.scenarioOptions = {};
        let newState = scenarioReducer(state, {type: SHOW_SCENARIOS, payload: scenarios});
        expect(newState.scenarioOptions).toBe(scenarios);
      });
    })
  });

  describe('Action Creators', () => {
    describe('showScenarios', () => {
      let mockShowScenariosDispatch = jest.fn();

      beforeEach(() => {
        mockShowScenariosDispatch.mockClear();
        showScenarios(mockShowScenariosDispatch)();
      });

      test('It dispatches the showScenarios action', () => {
        expect(mockShowScenariosDispatch)
        .toHaveBeenCalledWith(
          {
            type: SHOW_SCENARIOS,
            payload: scenarios
          });
      })
    })
  })
})
