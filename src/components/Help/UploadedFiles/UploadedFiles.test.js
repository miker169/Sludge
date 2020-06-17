import React from 'react';
import {render } from "@testing-library/react";
import UploadedFiles from "./index";
import { HelpContextProvider} from "../../../context/HelpContext";

describe('<UploadedFiles/>', () => {
  const wrapper = (props) => {
    return render(<HelpContextProvider><UploadedFiles {...props} /></HelpContextProvider>);
  }

  it('renders without error', () => {
    let props = {
      files: [
        'test.csv'
      ],
      helpText: 'test help text'
    }
    const {queryByTestId} = wrapper(props);
    const UploadedFilesHelp = queryByTestId('uploaded-files-component');
    expect(UploadedFilesHelp).toBeInTheDocument();
  });

});
