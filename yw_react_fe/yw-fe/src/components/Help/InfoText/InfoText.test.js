import React from 'react';
import { render } from "@testing-library/react";
import InfoText from "./index";

describe('<InfoText/>', () => {
  const wrapper = (props) => {
    return render(<InfoText {...props} />)
  }
  test('it renders without error', () => {
    const { queryByTestId } = wrapper();
    const InfoTextComponent = queryByTestId('info-text-component');
    expect(InfoTextComponent).toBeInTheDocument();
  });

  describe('When it has a load message', () => {
    let queryByTestId;
    let container;
    beforeEach(() => {
      ({queryByTestId, container} = wrapper({messages: {
          Load_message: "test load message"
        }}));
    });

    test('Displays load message info', () => {
      const loadMessages = queryByTestId('load-message')
      expect(loadMessages.textContent).toBe('test load message');
    });
  });

  describe('When it has a distance message', () => {
    let queryByTestId;
    let container;
    beforeEach(() => {
      ({queryByTestId, container} = wrapper({messages: {
          Distance_message: "test distance message"
        }}));
    });

    test('Displays distance message info', () => {
      const loadMessages = queryByTestId('distance-message')
      expect(loadMessages.textContent).toBe('test distance message');
    });
  });
});
