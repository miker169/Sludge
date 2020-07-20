import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import FileUpload from "./fileInput";
import { FileContext} from '../../context/FileContext'

describe('<FileUpload/>', () => {
  // let convertFilesToJsonMock = jest.fn();
  const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });
  const files = []
  const fileHandler =  jest.fn();
  const reset = jest.fn();
  const value = {files: files, setFileHandler: fileHandler, reset: reset}
  const wrapper = () => {
    return  render(<FileContext.Provider value={value}><FileUpload/></FileContext.Provider>)
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
      let queryByTestId;

      const fileUploadEvent = (fileName, fileType) => {
        const testFile =
          new Blob([{fileContents: 'tesying'}], {type: fileType});
        testFile.name = fileName
        mockEvent = {target: {files: [testFile]}};
        ({queryByTestId } = wrapper());
        hiddenFileInputElement = queryByTestId('hidden-input');
        fireEvent.change(hiddenFileInputElement, mockEvent);
      }

      test('It calls set file ', () => {
        fileUploadEvent('myFile.csv', 'text/csv');
        expect(fileHandler).toHaveBeenCalled();
      });

    })
  });
})
