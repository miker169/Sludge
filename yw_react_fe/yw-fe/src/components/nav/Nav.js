import React from "react";
import Button from "../Button/Button";
import "./Nav.css";

const Nav = () => {
  return (
    <ul data-testid="nav-container" className="nav">
      <li><Button active title="Standard Modelling"/></li>
      <li><Button title="Sludge Modelling Tool"/></li>
    </ul>
  )
}

export default Nav;
