import React  from 'react';
import { render } from '@testing-library/react';
import Arrow from "./index";


describe('<Arrow />', () => {
  test('it renders without error', () => {
    const { queryByTestId } = render(<Arrow />);
    const arrowElement = queryByTestId('component-arrow');
    expect(arrowElement).toBeInTheDocument();
  })

  test('renders without Error when passed a valid set of paths', () => {
    const { queryByTestId } = render(<Arrow  path="M105 205 Q 50 15 170 20"/>);
    const arrowElement = queryByTestId('component-arrow');
    expect(arrowElement).toBeInTheDocument();
  });

  test('takes a child path element and renders it', () => {
    let path = <path data-testid="child-path" className="nextArrow" markerEnd="url(#arrowhead)" d="M105 205 Q 50 15 170 20" strokeWidth="3" stroke="white" fill="transparent"/>;
    const { queryByTestId } = render(<Arrow>{path}</Arrow>);
    const childPathElement = queryByTestId('child-path');
    expect(childPathElement).toBeInTheDocument();
  })
});
