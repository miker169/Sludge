import React from 'react'
import { render } from '@testing-library/react';
import Help from './index';


describe('<Help/>', () => {
  const wrapper = () => {
    return render(<Help/>);
  }

  const helpText = "text text";
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(React, 'useContext')
    .mockImplementation((context) => {
      return {
        errorText: [],
        state: {helpText, files: [
            {name:'test'}
          ],
          warnings: false,
        inputDisabled: true,
        getResultsDisabled: true,
        runDisabled: true},
        start: jest.fn(),
      }
    })
  });

  test('renders without error', () => {
    let {queryByTestId} = wrapper();
    const help = queryByTestId('component-help');
    expect(help).toBeInTheDocument();
  });


  describe('When there are warnings', () => {
    let messages = { Load_message: "test", Distance_message: 'Distance Error'};
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: {
            warnings: true,
            messages: messages,
            files: [
              {name:'test'}
            ]
          },
          errorText: []
        }
      })
    });

    test('Does not display help text', () => {
      let {queryByTestId} = wrapper();
      const help = queryByTestId('flow-help');
      expect(help).not.toBeInTheDocument();
    });
  });

  // describe('When results are disabled', () => {
  //   let messages = {};
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     jest.spyOn(React, 'useContext')
  //     .mockImplementation((context) => {
  //       return {
  //         state: {helpText, files: [
  //             {name:'test'}
  //           ],
  //           inputDisabled: true,
  //           getResultsDisabled: true,
  //           runDisabled: true},
  //         start: jest.fn(),
  //       }
  //     })
  //   });
  //   describe('There are messages', () => {
  //     describe('Of Type Load', () => {
  //       beforeEach(() => {
  //         messages = {
  //           Load_message: "Error"
  //         }
  //       });
  //       test('Should container an infoError')
  //     })
  //   });
  // });

});
