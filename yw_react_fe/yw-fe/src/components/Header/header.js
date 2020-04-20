import React from 'react';
import './header.css';
import logo from "../../images/yw-logo-blue.png";

const Header = () => {
  return (
    <div data-testid="header-container" className="header-container">
      <div className="header-container__inner">
        <div className="header-container--home">
          <img className="logo" src={logo} alt="logo"/>
        </div>
        <h1>Sludge Modelling Tool</h1>
      </div>
    </div>
  )
}

export default Header;
