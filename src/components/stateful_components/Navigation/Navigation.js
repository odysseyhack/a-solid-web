import React from "react";
import rdf from "rdflib";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import NavBarProfile from "../../functional_components/NavBarProfile/NavBarProfile";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      picture: "",
      name: "",
    };
  }

  fetchProfile(){
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const webId = this.state.webId;

    if(webId){
      fetcher.load(webId).then(()=> {
        console.log("Loaded webId.")
      });
    }
  }

  componentDidMount(){
    this.fetchProfile();
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
          <NavBarProfile/>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
