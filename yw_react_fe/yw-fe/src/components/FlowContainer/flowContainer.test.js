import React  from 'react';
import { render } from '@testing-library/react';
import FlowContainer from "./index";
import { Provider as FlowProvider } from "../../context/FlowContext";
import userEvent from "@testing-library/user-event";

describe('<FlowContainer/>', () => {
  const wrapper = () => {

    return render(
      <FlowProvider >
        <FlowContainer />
      </FlowProvider>
      );
  }

  test('is disabled by default', () => {
    const {queryByTestId} = wrapper();
    const flowElement = queryByTestId('component-flow');
    expect(flowElement).toBeFalsy();
  });

  describe('When First Enabled', () => {
    let state = { enabled: true };
    const setstate = (newState) => {
      state = newState;
    }
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: state,
          start: jest.fn()
        }
      })
    });
    test('Shows the Flow Component', () => {
      const {queryByTestId} = wrapper();
      const flowElement = queryByTestId('component-flow');
      expect(flowElement).toBeTruthy();
    });

    test('Input Button is enabled', () => {
      setstate({
        enabled: true,
        inputDisabled: false,
      })
      const {queryByTestId} = wrapper();
      const inputButton = queryByTestId('input-component-btn');
      expect(inputButton).not.toHaveClass('disabled');
    });

    test('Update Button is disabled', () => {
      setstate({
        enabled: true,
        updateDisabled: true,
      })
      const {queryByTestId} = wrapper();
      const updateBtn = queryByTestId('update-component-btn');
      expect(updateBtn).toHaveClass('disabled');
    });

    test('Input Arrow is disabled', () => {
      setstate({
        enabled: true,
        inputArrowDisabled: true,
      })
      const {queryByTestId } = wrapper();
      const updateArrow = queryByTestId('input-component-arrow');
      expect(updateArrow).toHaveAttribute('disabled');
    });

    test('Update Arrow is disabled', () => {
      setstate({
        enabled: true,
        updateArrowDisabled: true,
      })
      const {queryByTestId} = wrapper();
      const updateArrow = queryByTestId('update-component-arrow');
      expect(updateArrow).toHaveClass('disabled');
    });

    test('Run Model Button Is Disabled', () => {
      setstate({
        enabled: true,
        updateDisabled: true,
        runDisabled: true,
      })
      const {queryByTestId} = wrapper();
      const runBtn = queryByTestId('run-component-btn');
      expect(runBtn).toHaveClass('disabled');
    });

    test('Run Model Button Is Disabled', () => {
      setstate({
        enabled: true,
        runDisabled: true,
      })
      const {queryByTestId} = wrapper();
      const runBtn = queryByTestId('run-component-btn');
      expect(runBtn).toHaveClass('disabled');
    });

    test('Run Arrow Is Disabled', () => {
      setstate({
        enabled: true,
        updateDisabled: true,
        nextArrowDisabled: true
      })
      const {queryByTestId } = wrapper();
      const runArrow = queryByTestId('run-component-arrow');
      expect(runArrow).toHaveAttribute('disabled');
    });

    test('Results Button is Disabled', () => {
      setstate({
        enabled: true,
        updateDisabled: true,
        getResultsDisabled: true,
      })
      const {queryByTestId} = wrapper();
      const resultsBtn = queryByTestId('results-component-btn');
      expect(resultsBtn).toHaveClass('disabled');
    });

    describe('When Input Button is Clicked', () =>{
      let uploadDataMock = jest.fn();
      beforeEach(()=> {
        jest.clearAllMocks();
        jest.spyOn(React, 'useContext')
        .mockImplementation((context) => {
          return {
            state: state,
            start: jest.fn(),
            uploadData: uploadDataMock
          }
        })
      })
      test('It calls the uploadData function', () => {
        const {queryByTestId} = wrapper();
        const inputBtn = queryByTestId('input-component-btn');
        userEvent.click(inputBtn);
        expect(uploadDataMock).toHaveBeenCalled();
      });

      test('Whilst running shows the arrow', () => {
        jest.clearAllMocks();
        jest.useFakeTimers()
        setstate({
            enabled: true,
            inputDisabled: true,
            updateDisabled: false,
            inputArrowDisabled: false
          });
        const {queryByTestId} = wrapper();
        const inputBtn = queryByTestId('input-component-btn');
        userEvent.click(inputBtn);
        jest.runAllTimers();
        const updateArrow = queryByTestId('input-component-arrow');
        expect(updateArrow).not.toHaveAttribute('disabled');
      });


      describe('Update data button is clicked',  () => {
        let updateDataMock = jest.fn();
        beforeEach(()=> {
          jest.clearAllMocks();
          jest.spyOn(React, 'useContext')
          .mockImplementation((context) => {
            return {
              state: state,
              start: jest.fn(),
              updateData: updateDataMock
            }
          })
        })
        test("calls update Data", () => {
          const {queryByTestId} = wrapper();
          const updateBtn = queryByTestId('update-component-btn');
          userEvent.click(updateBtn);
          expect(updateDataMock).toHaveBeenCalled();
        });

        test('Whilst running shows the arrow', () => {
          jest.clearAllMocks();
          jest.useFakeTimers()
          setstate({
            enabled: true,
            updateArrowDisabled: false
          });
          const {queryByTestId} = wrapper();
          const runBtn = queryByTestId('run-component-btn');
          userEvent.click(runBtn);
          jest.runAllTimers();
          const updateArrow = queryByTestId('run-component-arrow');
          expect(updateArrow).not.toHaveAttribute('disabled');
        });
      });

      describe('Run Model is clicked', () => {
        let runDataMock = jest.fn();
        beforeEach(()=> {
          jest.clearAllMocks();
          jest.spyOn(React, 'useContext')
          .mockImplementation((context) => {
            return {
              state: state,
              start: jest.fn(),
              runData: runDataMock
            }
          })
        })

        test('it calls the runModel function', () => {
          const {queryByTestId} = wrapper();
          const runBtn = queryByTestId('run-component-btn');
          userEvent.click(runBtn);
          expect(runDataMock).toHaveBeenCalled();
        });

        test('Whilst running shows the arrow', () => {
          jest.clearAllMocks();
          jest.useFakeTimers()
          setstate({
            enabled: true,
            inputDisabled: true,
            updateDisabled: false,
            nextArrowDisabled: false
          });
          const {queryByTestId} = wrapper();
          const runBtn = queryByTestId('run-component-btn');
          userEvent.click(runBtn);
          jest.runAllTimers();
          const updateArrow = queryByTestId('run-component-arrow');
          expect(updateArrow).not.toHaveAttribute('disabled');
        });
      });
    })

  })


});
