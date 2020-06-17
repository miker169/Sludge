import React from 'react';
import { render, screen} from "@testing-library/react";
import ParamsForm from "./index";

describe.skip('paramsForm', () => {
  const params =  {
    distanceCalibration: 2,
    driversLiquid: 4,
    driversCake: 1,
    kmperdriverliquid: 250,
    kmperdrivecake: 225,
  };
  const setUp = (props) => {

    render(<ParamsForm params={params} {...props}/>)
  }

  test('it renders without error', () => {
   setUp();
    const paramsForm = screen.queryByTestId('params-component')
    expect(paramsForm).toBeInTheDocument();
  })


  describe('When disabled', () => {
    test('params form is hidden', () => {
      setUp({disabled: true});
      const paramsForm = screen.queryByTestId('params-component');
      expect(paramsForm).not.toBeInTheDocument();
    })
  });

  describe('When enabled', () => {
    test('params form is shown', () => {
      setUp({disabled: false});
      screen.queryByTestId('params-component');
    });

    describe('params form', () => {
      const formSetUp = (props) => {
        render(<ParamsForm params={params} disabled={false} {...props}/> )
      }

      beforeEach(() => {
        formSetUp();
      })

      test('It has a form', () => {
        screen.queryByTestId('params-form');
      });

      test('It has a form title', () => {
        screen.getByRole('heading', /Sludge Modelling Params/);
      });

      test('It has a field for drivers liquid', () => {
        screen.getByLabelText(/Drivers:Liquid/);
        screen.getAllByRole('textbox', /Drivers:Liquid/)
      })
      test('It has a field for drivers cake', () => {
        screen.getByLabelText(/Drivers:Cake/);
        screen.getAllByRole('textbox', /Drivers:Cake/)
      })
    });
  })
})
