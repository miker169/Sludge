import React from "react";
import Button from "../Button/Button";
import "./Nav.css";

const Nav = () => {
  return (
    <ul data-testid="nav-container" className="nav">
      <li><Button active title="Run Model WorkFlow"/></li>
      <li><Button title="Manage"/></li>
    </ul>
  )
}

export default Nav;
