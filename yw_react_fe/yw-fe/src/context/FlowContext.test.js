import React, {useEffect} from 'react';
import {
  flowReducer,
  START_FLOW,
  UPLOADING_DATA,
  RUN_DATA,
  RAN_DATA_MODEL,
  INPUT_DATA,
  uploadData,
  runData,
  inputData,
  start
} from './FlowContext';


describe('FlowContext', () => {

  describe('reducer', () => {
    let state = {};

   describe('When type is START_FLOW', () => {

     test('it returns some default state', () => {
       state.testData = 'hello';
       let newState = flowReducer(state, {type: START_FLOW});
       expect(newState.testData).toBe('hello');
     });

   });

    describe('When type is INPUT_DATA', () => {
      let newState = flowReducer(state, {type: INPUT_DATA});
      expect(newState.inputArrowRan).toBeTruthy();
    });

    describe('When type is UPLOADING_DATA', () => {
      let newState = flowReducer(state, {type: UPLOADING_DATA});
      expect(newState.inputArrowDisabled).toBeFalsy();
    });

    describe('When type is RUN_DATA', () => {
      let newState = flowReducer(state, {type: RUN_DATA});
      expect(newState.nextArrowDisabled).toBeFalsy();
    });

    describe('When type is RUN_DATA_MODEL', () => {
      let newState = flowReducer(state, {type: RAN_DATA_MODEL});
      expect(newState.getResultsDisabled).toBeFalsy();
    });

    describe('When type is unknown it returns default state', () => {
      let newState = flowReducer({test: true}, {type: 'UNKNOWN'});
      expect(newState.test).toBeTruthy();
    });

    describe('action creators', () => {
      describe('Upload Data', () => {
        let mockDispatch = jest.fn();
        // replaces setTimeout with a mock.
        jest.useFakeTimers();
        beforeEach(() => {
          mockDispatch.mockClear();
          uploadData(mockDispatch)();
        })
        test('uploadData dispatches UPLOADINGDATA action', () => {
          expect(mockDispatch).toHaveBeenCalledWith({type: UPLOADING_DATA});
        });

        test('uploadData also fires INPUT_DATA action', () => {
          // runs the setTimeout Mock
          jest.runAllTimers();
          expect(mockDispatch).toHaveBeenCalledWith({type: INPUT_DATA});
        });
      })
      describe('run data', () => {
        let mockRunDispatch = jest.fn();
        // replaces setTimeout with a mock.
        jest.useFakeTimers();
        beforeEach(() => {
          mockRunDispatch.mockClear();
          runData(mockRunDispatch)();
        });

        test('calls RUN_DATA reducer action', () => {
          expect(mockRunDispatch).toHaveBeenCalledWith({type: RUN_DATA});
        });

        // test('calls RAN_DATA_MODEL reducer action', () => {
        //   jest.runAllTimers();
        //   expect(mockRunDispatch).toHaveBeenCalledWith({type: RAN_DATA_MODEL});
        // });


      });
      describe('inputData', () => {
        let mockInputDispatch = jest.fn();
        // replaces setTimeout with a mock.
        beforeEach(() => {
          mockInputDispatch.mockClear();
          inputData(mockInputDispatch)();
        });
        test('It dispatches the INPUT_DATA action', () => {
          expect(mockInputDispatch).toHaveBeenCalledWith({type: INPUT_DATA});
        })
      })
      describe('start', () => {
        let mockStartDispatch = jest.fn();
        let testFile = 'myfile.csv';
        // replaces setTimeout with a mock.
        beforeEach(() => {
          mockStartDispatch.mockClear();
          start(mockStartDispatch)(testFile);
        });
        test('It dispatches the START action with a file payload', () => {
          expect(mockStartDispatch)
          .toHaveBeenCalledWith(
            {
                  type: START_FLOW,
                  payload: testFile
            });
        })
      });

    })

  })

});
