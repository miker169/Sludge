import React, {createElement} from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import FileUpload from "./fileInput";


describe('<FileUpload/>', () => {
  test('renders without error', () => {
    const { queryByTestId } = render(<FileUpload />);
    const uploadElement = queryByTestId('component-file-upload')
    expect(uploadElement).toBeInTheDocument();
  });

  test('when clicked on opens a file dialog', () => {
    /*
      Mock out the ref object as that what gets called when
      its added to the ref.
     */
   let mockRef = jest.spyOn(React, 'useRef').mockReturnValue({
     current: {
       click: jest.fn()
     }
   })
    /*
      Get the upload element and check that the mocked Event has been called.
     */
    const { queryByTestId, getByRole } = render(<FileUpload />);
    const uploadElement = queryByTestId('component-file-upload')
    userEvent.click(uploadElement);
    expect(mockRef).toHaveBeenCalled();

  });
})
