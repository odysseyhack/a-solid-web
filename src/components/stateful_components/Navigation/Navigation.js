import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import NavBarProfile from "../../functional_components/NavBarProfile/NavBarProfile";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: undefined,
      name: undefined
    };
  }

  fetchProfile(webId) {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    if (webId) {
      fetcher.load(webId).then(() => {
        const picture = store.any(rdf.sym(webId), VCARD("hasPhoto"))
        const pictureValue = picture 
          ? picture.value
          : undefined;
        const name = store.any(rdf.sym(webId), FOAF("name"))
        const nameValue = name
          ? name.value
          : undefined;
        this.setState({
          name: nameValue,
          picture: pictureValue
        });
        console.log(this.state)
      });
    }
  }

  componentDidMount() {
    auth.trackSession(session => {
      if (session) {
        this.fetchProfile(session.webId);
      }
    });
  }

  render() {
    return (
      <div style={{ padding: "2%" }}>
        <Navbar bg="light" variant="light" fixed="top">
          <Navbar.Brand>
            <img src="favicon.ico" width="30" height="30" alt="Solid logo" />
            <span style={{ marginLeft: "5%" }}>Solid Web</span>
          </Navbar.Brand>
          <Nav className="mr-auto">
            <NavLink to="/" style={{ color: "#000", marginLeft: "10%" }}>
              Profile
            </NavLink>
          </Nav>
          <NavBarProfile picture={this.state.picture} name={this.state.name}/>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
