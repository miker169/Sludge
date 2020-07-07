import React from 'react';
import './paramsForm.css';
import TextField from './Fields/TextField';

const ParamsForm = React.memo(({ disabled, params, setParams }) => {

  const setFieldHandler = e => {

    if(!isNaN(e.target.value)){
      setParams(e.target.value, e.target.name)
    }
  };

  if (disabled) return null;
  return (
    <div data-testid="params-component">
      <p>If you change these, this will change the default for all values.</p>
      <form className="params-form" data-testid="params-form">
        <TextField
          name="driversLiquid"
          value={params.driversLiquid}
          setField={setFieldHandler}
          placeholder="Input drivers liquid"
          title="Drivers: Liquid"
        />
        <TextField
          name="driversCake"
          setField={setFieldHandler}
          value={params.driversCake}
          title="Drivers:Cake"
          placeholder="Input drivers cake"
        />
        <TextField
          name="kmperdriverliquid"
          placeholder="Input km/hour liquid"
          setField={setFieldHandler}
          value={params.kmperdriverliquid}
          title="KM per Driver: Liquid"
        />
        <TextField
          value={params.kmperdrivercake}
          setField={setFieldHandler}
          name="kmperdrivercake"
          placeholder="Input km/hour cake"
          title="KM per Driver: Cake"
        />
        <TextField
          value={params.distanceCalibration}
          setField={setFieldHandler}
          name="distanceCalibration"
          placeholder="Distance Calibration"
          title="Distance Calibration"
        />
      </form>
    </div>
  );
});

export default ParamsForm;
