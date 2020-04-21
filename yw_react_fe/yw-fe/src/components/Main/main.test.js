import React from 'react';
import { render} from "@testing-library/react";
import Main from './index';

describe('<Main/>',  () => {
  test('it renders without error', () => {
    const {queryByTestId } = render(<Main/>);
    const mainComponent = queryByTestId('component-main');
    expect(mainComponent).toBeInTheDocument();
  });
})
