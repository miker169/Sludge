import React, {createElement} from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import FileUpload from "./fileInput";
import {Provider as FlowProvider, setFile} from "../../context/FlowContext";


describe('<FileUpload/>', () => {
  const wrapper = () => {
    return  render(
      <FlowProvider>
        <FileUpload />
      </FlowProvider>);
  }
  test('renders without error', () => {
    const {queryByTestId} = wrapper();
    const uploadElement = queryByTestId('component-file-upload')
    expect(uploadElement).toBeInTheDocument();
  });

  test('Has a label with default text', () => {
    const defaultText = "Upload CSV";
    const {queryByTestId} = wrapper();
    const fileLabelElement = queryByTestId('fileLabel')
    expect(fileLabelElement.textContent).toContain(defaultText);
  });

  describe('When Clicked', () => {
    let mockRef = jest.spyOn(React, 'useRef').mockReturnValue({
      current: {
        click: jest.fn()
      }
    })
    test('opens a file dialog', () => {
      const {queryByTestId} = wrapper();
      const uploadElement = queryByTestId('component-file-upload')
      userEvent.click(uploadElement);
      expect(mockRef).toHaveBeenCalled();

    });

    describe('When file selected', () => {
      let hiddenFileInputElement;
      let mockEvent = jest.fn();
      let startFlowMock = jest.fn();
      let queryByTestId;
      let setFileMock = jest.fn();

      const fileUploadEvent = (fileName, fileType) => {
        const testFile =
          new Blob([{fileContents: 'tesying'}], {type: fileType});
        testFile.name = fileName
        mockEvent = {target: {files: [testFile]}};
        ({queryByTestId } = wrapper());
        hiddenFileInputElement = queryByTestId('hidden-input');
        fireEvent.change(hiddenFileInputElement, mockEvent);
      }

      beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(React, 'useContext')
        .mockImplementation((context) => {
          return {
            setFile: setFileMock,
            start: startFlowMock
          }
        });
    });

      test('It calls set file ', () => {
        fileUploadEvent('myFile.csv', 'text/csv');
        expect(setFileMock).toHaveBeenCalled();
      });

      test('It starts the workflow', () => {
        fileUploadEvent('myFile.csv', 'text/csv');
        expect(startFlowMock).toHaveBeenCalled();
      });
    })
  });

  // describe('When file selected', () => {
  //   let hiddenFileInputElement;
  //   let mockEvent = jest.fn();
  //   let startFlowMock = jest.fn();
  //   let queryByTestId;
  //   const fireFileUploadEvent = (fileName, fileType) => {
  //     /*
  //       I've decided to mock out the event , I could have just as
  //       easily spied on React.useState and set the value of the
  //       file name.
  //      */
  //     const testFile = new Blob(
  //       [{fileContents: 'tesying'}], {type: fileType});
  //     testFile.name = fileName
  //     mockEvent = {target: {files: [testFile]}};
  //     ({queryByTestId } = wrapper());
  //     hiddenFileInputElement = queryByTestId('hidden-input');
  //     fireEvent.change(hiddenFileInputElement, mockEvent);
  //   }
  //
  //   beforeEach(() => {
  //
  //     jest.spyOn(React, 'useContext')
  //     .mockImplementation((context) => {
  //       return {
  //         setFile: jest.fn(),
  //         start: startFlowMock
  //       }
  //     })
  //   })
  //   test('it displays the filename selected', () => {
  //     const testFileName = 'my-test-file.csv';
  //     const testFileType = 'application/csv';
  //     fireFileUploadEvent(testFileName, testFileType);
  //
  //     const labelText = queryByTestId('fileLabel');
  //     expect(labelText.textContent).toContain(testFileName);
  //   });
  //
  //   test('it can only accept csv', () => {
  //     const defaultText = "Upload CSV";
  //     const testFileName = 'my-test-file.js';
  //     const testFileType = 'application/json';
  //
  //     const {queryByTestId} = wrapper();
  //     const labelText = queryByTestId('fileLabel');
  //     hiddenFileInputElement = queryByTestId('hidden-input');
  //     fireFileUploadEvent(testFileName, testFileType);
  //
  //     expect(labelText.textContent).toContain(defaultText);
  //   });
  //
  //
  //   test('it starts the flow', () => {
  //     let newStartMock = jest.fn();
  //     jest.spyOn(React, 'useContext')
  //     .mockImplementation((context) => {
  //       return {
  //         setFile: jest.fn(),
  //         start: newStartMock
  //       }
  //     })
  //     const {queryByTestId} = wrapper();
  //     hiddenFileInputElement = queryByTestId('hidden-input');
  //
  //     fireFileUploadEvent('test', 'applicaton/csv');
  //     expect(startFlowMock).toHaveBeenCalled();
  //
  //   });
  // })
})
