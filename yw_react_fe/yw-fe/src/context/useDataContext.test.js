import React from 'react';
import { render } from '@testing-library/react';
import useDataContext from "./useDataContext";


describe('dataContextFactory', () => {
  let reducer = (state, {type, payload}) => {
    switch (type) {
      case 'TEST':
        return 'test';
      default:
        return 'default'

    }
  }
  const setTest = dispatch => () => dispatch({type: 'TEST'});
  const {Context, Provider } = useDataContext(reducer,{setTest}, "");

  const FunctionalComponent = () => {
    const {state, setTest} = React.useContext(Context);
    return (
      <div></div>)

  }


  describe('Returns a Context Object and a provider', () => {
    test('That does not throw an error when wrapping another element', () => {
      const {container} = render(<Provider><FunctionalComponent/></Provider>);
      expect(container).toBeInTheDocument();
    });
  });
});
