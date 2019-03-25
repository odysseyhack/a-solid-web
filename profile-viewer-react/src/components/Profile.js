import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import { Button } from "yoda-design-system";
import Container from "react-bootstrap/Container";
import ProfilePicture from "./functional_components/ProfilePicture"
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
			picture: "",
      emails: [],
      job: "",
      bio: "",
      telephones: []
    };
	}

  async login() {
    const session = await auth.currentSession();
    if (!session) await auth.login("https://solid.community");
    else alert(`Logged in as ${session.webId}`);
  }

  async logout() {
    auth.logout().then(() => {
      this.setState({
        webId: ""
      });
    });
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
					const name = store.any(rdf.sym(webId), FOAF("name"))
					const nameValue = name ? name.value : "";

          var emails = [];
          store.each(rdf.sym(webId), VCARD("hasEmail")).forEach(emailBlankId => {
						store.each(rdf.sym(emailBlankId), VCARD("value")).forEach(emailAddress => {
								emails.push([emailAddress.value, emailBlankId.value]);
							});
					});

					const picture = store.any(rdf.sym(webId), VCARD("hasPhoto"));
					const pictureValue = picture ? picture.value : "";

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
						picture: pictureValue,
            emails: emails,
            job: jobValue,
            bio: bioValue,
            telephones: telephones
          });
        });
      }
    });
  }
	
	setProfilePicture = e => {
    var filePath = e.target.files[0];
    var store = rdf.graph();
    var fetcher = new rdf.Fetcher(store);

    let webId = this.state.webId;
    let currentPicture = this.state.picture;

    var reader = new FileReader();
    reader.onload = function() {
      var data = this.result;
      var filename = encodeURIComponent(filePath.name);
      var contentType = "image";
      let pictureURl = webId.replace("card#me", filename);
      fetcher
        .webOperation("PUT", pictureURl, {
          data: data,
          contentType: contentType
        })
        .then(response => {
          if (response.status === 201) {
            const updater = new rdf.UpdateManager(store);
            let del = currentPicture
              ? rdf.st(
                  rdf.sym(webId),
                  VCARD("hasPhoto"),
                  rdf.sym(currentPicture),
                  rdf.sym(webId).doc()
                )
              : [];
            let ins = rdf.st(
              rdf.sym(webId),
              VCARD("hasPhoto"),
              rdf.sym(pictureURl),
              rdf.sym(webId).doc()
            );
            updater.update(del, ins, (uri, ok, message) => {
              if (ok)
                console.log(
                  "Changes have been applied, reload page to see them"
                );
              else alert(message);
            });
          }
        });
    };
    reader.readAsArrayBuffer(filePath);
  };

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    return (
      <Container>
				<Row>
					<Col>
						<ProfilePicture picture={this.state.picture} onChange={this.setProfilePicture}/>
					</Col>
					<Col>
						{this.state.name}
					</Col>
				</Row>
        <Row>
          {this.state.webId !== "" ? (
							<Button onClick={this.logout.bind(this)}>Logout</Button>
          ) : (
								<Button onClick={this.login.bind(this)}>Login</Button>
          )}
        </Row>
      </Container>
    );
  }
}

export default Profile;
