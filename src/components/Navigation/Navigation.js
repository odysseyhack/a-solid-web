import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { Button } from "yoda-design-system";

const Navigation = () => {
  
    return (
      <div style={{ padding: "3%" }}>
        <Navbar bg="light" variant="light" fixed="top">
          <Navbar.Brand>
            <img src="favicon.ico" width="30" height="30" alt="Solid logo" />
            <span style={{ marginLeft: "5%" }}>Dr Martens</span>
          </Navbar.Brand>
          <Nav className="mr-auto">
            <NavLink 
              to="/health-app/" 
              style={{ color: "#000", marginLeft: "25%" }}>
              Healthcase
            </NavLink>
            <NavLink 
              to="/getuser" 
              style={{ color: "#000", marginLeft: "25%" }}>
              Usercheck
            </NavLink>
          </Nav>
        </Navbar>
      </div>
    );
  }
 
export default Navigation;
