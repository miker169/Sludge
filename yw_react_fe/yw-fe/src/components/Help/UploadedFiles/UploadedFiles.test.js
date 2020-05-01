import React from 'react';
import {render } from "@testing-library/react";
import UploadedFiles from "./index";

describe('<UploadedFiles/>', () => {
  const wrapper = (props) => {
    return render(<UploadedFiles {...props} />);
  }

  it('renders without error', () => {
    let props = {
      files: [
        {name:'test'}
      ],
      helpText: 'test help text'
    }
    const {queryByTestId} = wrapper(props);
    const UploadedFilesHelp = queryByTestId('uploaded-files-component');
    expect(UploadedFilesHelp).toBeInTheDocument();
  });

});
