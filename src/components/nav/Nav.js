import React from "react";
import Button from "../Button/Button";
import "./Nav.css";

const Nav = ({clickHandler, activeTab}) => {
  return (
    <ul data-testid="nav-container" className="nav">
      <li><Button name="workflow" active={activeTab == "workflow"} title="Run Model WorkFlow" clickHandler={clickHandler}/></li>
      <li><Button name="params" active={activeTab === "params"} title="Manage Params" clickHandler={clickHandler}/></li>
    </ul>
  )
}

export default Nav;
