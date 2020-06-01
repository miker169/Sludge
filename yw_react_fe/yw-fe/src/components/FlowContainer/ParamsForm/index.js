import React from 'react'
import './paramsForm.css';

const ParamsForm = ({disabled, params, setParams}) => {

  if(disabled) return null;
  return (
    <div data-testid="params-component">
      <h2 className="header">Sludge Modelling Parameters</h2>
      <form data-testid="params-form">
        <div className="params-field">
          <label htmlFor="driversLiquid" placeholder="Input drivers liquid" className="field-label">Drivers:Liquid</label>
          <input id="driversLiquid"  value={params.driversLiquid} onChange={(evt) => setParams(evt,'driversLiquid')} className="field-input" type="text"/>
        </div>
        <div className="params-field">
          <label htmlFor="driversCake" placeholder="Input drivers cake" className="field-label">Drivers:Cake</label>
          <input id="driversCake"
                 className="field-input"
                 type="text"
                 value={params.driversCake}
                 onChange={(evt) => setParams(evt,'driversCake')}
          />
        </div>
        <div className="params-field">
          <label htmlFor="kmperdriveliquid" placeholder="Input km/hour liquid" className="field-label">KM per Driver: Liquid</label>
          <input
            id="kmperdriverliquid"
            className="field-input"
            type="text"
            value={params.kmperdriverliquid}
            onChange={(evt) => setParams(evt, 'kmperdriverliquid')}
          />
        </div>
        <div className="params-field">
          <label htmlFor="kmperdrivercake" placeholder="Input km/hour cake" className="field-label">KM per Driver: Cake</label>
          <input
            id="kmperdrivercake"
            className="field-input"
            type="text"
            value={params.kmperdrivecake}
            onChange={(evt) => setParams(evt, 'kmperdrivercake') }
          />
        </div>
        <div className="params-field">
          <label htmlFor="distanceCalibration" placeholder="Distance Calibration" className="field-label">Distance Calibration</label>
          <input
            id="distanceCalibration"
            className="field-input"
            type="text"
            value={params.distanceCalibration}
            onChange={(evt) => setParams(evt, 'distanceCalibration')}
          />
        </div>

      </form>
    </div>
  );
}

export default ParamsForm
