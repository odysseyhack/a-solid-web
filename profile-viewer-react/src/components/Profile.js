import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import { AuthButton } from "@solid/react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: "",
      name: "",
      emails: [],
      job: "",
      bio: "",
      telephones: []
    };
  }

  fetchUser() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        console.log("You are logged in... Fetching your data now");

        const webId = session.webId;

        const store = rdf.graph();
        const fetcher = new rdf.Fetcher(store);

        fetcher.load(webId).then(() => {
          const name = store.any(rdf.sym(webId), FOAF("name"));
          const nameValue = name ? name.value : "";

          var emails = [];
          store
            .each(rdf.sym(webId), VCARD("hasEmail"))
            .forEach(emailBlankId => {
              store
                .each(rdf.sym(emailBlankId), VCARD("value"))
                .forEach(emailAddress => {
                  emails.push([emailAddress.value, emailBlankId.value]);
                });
            });

          const job = store.any(rdf.sym(webId), VCARD("role"));
          const jobValue = job ? job.value : "";

          const bio = store.any(rdf.sym(webId), VCARD("note"));
          const bioValue = bio ? bio.value : "";

          var telephones = [];
          store
            .each(rdf.sym(webId), VCARD("hasTelephone"))
            .forEach(telephoneBlankId => {
              store
                .each(rdf.sym(telephoneBlankId), VCARD("value"))
                .forEach(telephoneNumber => {
                  telephones.push([
                    telephoneNumber.value,
                    telephoneBlankId.value
                  ]);
                });
            });

          this.setState({
            webId: webId,
            name: nameValue,
            emails: emails,
            job: jobValue,
            bio: bioValue,
            telephones: telephones
          });
        });
      }
    });
  }

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    return (
      <Container>
        <Row>
          <Col lg={3} md={3} sm={3} xs={3}/>
          <Col lg={6} md={6} sm={6} xs={6}>
            <AuthButton
              popup="popup.html"
              login="Login here!"
              logout="Logout here!"
            />
          </Col>
          <Col lg={3} md={3} sm={3} xs={3}/>
        </Row>
      </Container>
    );
  }
}

export default Profile;
