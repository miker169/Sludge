import React, {createElement} from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import FileUpload from "./fileInput";
import { Provider as FlowProvider } from "../../context/FlowContext";


describe('<FileUpload/>', () => {
  let queryByTestId;
  beforeEach(() => {
    ({queryByTestId} = render(
      <FlowProvider>
        <FileUpload />
      </FlowProvider>));
  })
  test('renders without error', () => {
    const uploadElement = queryByTestId('component-file-upload')
    expect(uploadElement).toBeInTheDocument();
  });

  test('Has a label with default text', () => {
    const defaultText = "Choose a csv file…";
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
      const uploadElement = queryByTestId('component-file-upload')
      userEvent.click(uploadElement);
      expect(mockRef).toHaveBeenCalled();

    });
  });

  describe('When file selected', () => {
    let hiddenFileInputElement;
    let mockEvent = jest.fn();
    let startFlowMock = jest.fn();
    const fireFileUploadEvent = (fileName, fileType) => {
      /*
        I've decided to mock out the event , I could have just as
        easily spied on React.useState and set the value of the
        file name.
       */
      const testFile = new Blob(
        [{fileContents: 'tesying'}], {type: fileType});
      testFile.name = fileName
      mockEvent = {target: {files: [testFile]}};
      fireEvent.change(hiddenFileInputElement, mockEvent);
    }
    beforeEach(() => {
      hiddenFileInputElement = queryByTestId('hidden-input');
      jest.spyOn(React, 'useContext')
      .mockImplementation((context) => {
        return {
          state: { enabled: false},
          start: startFlowMock
        }
      })
    })
    test('it displays the filename selected', () => {
      const testFileName = 'my-test-file.csv';
      const testFileType = 'application/csv';
      fireFileUploadEvent(testFileName, testFileType);

      const labelText = queryByTestId('fileLabel');
      expect(labelText.textContent).toContain(testFileName);
    });

    test('it can only accept csv', () => {
      const defaultText = "Choose a csv file…";
      const testFileName = 'my-test-file.js';
      const testFileType = 'application/json';

      fireFileUploadEvent(testFileName, testFileType);

      const labelText = queryByTestId('fileLabel');
      expect(labelText.textContent).toContain(defaultText);
    });


    test('it starts the flow', () => {

      fireFileUploadEvent('test', 'applicaton/csv');
      expect(startFlowMock).toHaveBeenCalled();

    });
  })
})
