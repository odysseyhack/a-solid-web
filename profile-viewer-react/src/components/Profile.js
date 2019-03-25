import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import { Button } from "yoda-design-system";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

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
	
	async login() {
		const session = await auth.currentSession();
		if (!session)
			await auth.login("https://solid.community");
		else
			alert(`Logged in as ${session.webId}`);
	}

	async logout(){
		auth.logout().then(() => {
			this.setState({
				webId: ""
			})
		})
	}

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    return (
      <Container>
        <Row>
            {this.state.webId !== "" ? <Button onClick={this.logout.bind(this)}>Logout</Button> : <Button onClick={this.login.bind(this)}>Login</Button>}
        </Row>
      </Container>
    );
  }
}

export default Profile;
