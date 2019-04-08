import React from "react";
import rdf from "rdflib";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { NavLink } from "react-router-dom";
import { Button } from "yoda-design-system";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: props.webId,
      picture: "",
      name: "",
    };
  }

  render() {
    return (
      <div style={{ padding: "2%" }}>
        <Navbar bg="light" variant="light" fixed="top">
          <Navbar.Brand>
            <img src="favicon.ico" width="30" height="30" alt="Solid logo" />
            <span style={{marginLeft: "5%"}}>Solid Web</span>
          </Navbar.Brand>
          <Nav className="mr-auto">
            <NavLink to="/" style={{color: "#000", marginLeft: "10%"}}>Profile</NavLink>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
