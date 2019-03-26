import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import { Button } from "yoda-design-system";
import Container from "react-bootstrap/Container";
import ProfilePicture from "./functional_components/ProfilePicture";
import NameSlot from "./functional_components/NameSlot";
import BioSlot from "./functional_components/BioSlot";
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
      telephones: [],
      newName: "",
      editName: false,
      newBio: "",
      editBio: false
    };
  }

  async logout() {
    auth.logout().then(() => {
      this.setState({
        webId: ""
      });
    });
  }

  fetchUser = () => {
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
          const nameValue = name ? name.value : undefined;

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

          const picture = store.any(rdf.sym(webId), VCARD("hasPhoto"));
          const pictureValue = picture ? picture.value : "";

          const job = store.any(rdf.sym(webId), VCARD("role"));
          const jobValue = job ? job.value : "";

          const bio = store.any(rdf.sym(webId), VCARD("note"));
          const bioValue = bio ? bio.value : undefined;

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
            telephones: telephones,
            newName: nameValue,
            editMode: false
          });
        });
      }
    });
  };

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

  applyNameChanges() {
    const store = rdf.graph();
    const updater = new rdf.UpdateManager(store);

    var del;
    var ins;

    del = rdf.st(
      rdf.sym(this.state.webId),
      FOAF("name"),
      rdf.lit(this.state.name),
      rdf.sym(this.state.webId).doc()
    );
    ins = rdf.st(
      rdf.sym(this.state.webId),
      FOAF("name"),
      rdf.lit(this.state.newName),
      rdf.sym(this.state.webId).doc()
    );

    var updatePromise = new Promise((resolve, reject) => {
      updater.update(del, ins, (uri, ok, message) => {
        if (ok) {
          console.log("Changes have been applied!");
          resolve();
        } else reject(message);
      });
      this.setState({ editName: false });
    });
    updatePromise.then(() => {
      this.fetchUser();
    });
  }

  getNewName(e) {
    this.setState({ newName: e.target.value });
  }

  toggleEditName() {
    this.setState({ editName: !this.state.editName });
  }

  applyBioChanges() {
    const store = rdf.graph();
    const updater = new rdf.UpdateManager(store);

    var del;
    var ins;

    del = rdf.st(
      rdf.sym(this.state.webId),
      VCARD("note"),
      rdf.lit(this.state.bio),
      rdf.sym(this.state.webId).doc()
    );
    ins = rdf.st(
      rdf.sym(this.state.webId),
      VCARD("note"),
      rdf.lit(this.state.newBio),
      rdf.sym(this.state.webId).doc()
    );

    var updatePromise = new Promise((resolve, reject) => {
      updater.update(del, ins, (uri, ok, message) => {
        if (ok) {
          console.log("Changes have been applied!");
          resolve();
        } else reject(message);
      });
      this.setState({ editBio: false });
    });
    updatePromise.then(() => {
      this.fetchUser();
    });
  }

  getNewBio(e) {
    this.setState({ newBio: e.target.value });
  }

  toggleEditBio() {
    this.setState({ editBio: !this.state.editBio });
  }

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    let nameSlotMarkup =
      this.state.name ? (
        <NameSlot
          name={this.state.name}
          editMode={this.state.editName}
          onBlur={this.applyNameChanges.bind(this)}
          onChange={this.getNewName.bind(this)}
          onClick={this.toggleEditName.bind(this)}
        />
      ) : (
        <NameSlot
          name="You did not enter your name yet..."
          editMode={this.state.editName}
          onBlur={this.applyNameChanges.bind(this)}
          onChange={this.getNewName.bind(this)}
          onClick={this.toggleEditName.bind(this)}
        />
      );

    let bioSlotMarkup =
      this.state.bio ? (
        <BioSlot
          bio={this.state.bio}
          editMode={this.state.editBio}
          onBlur={this.applyBioChanges.bind(this)}
          onChange={this.getNewBio.bind(this)}
          onClick={this.toggleEditBio.bind(this)}
        />
      ) : (
        <BioSlot
          bio="You do not have a bio yet..."
          editMode={this.state.editBio}
          onBlur={this.applyBioChanges.bind(this)}
          onChange={this.getNewBio.bind(this)}
          onClick={this.toggleEditBio.bind(this)}
        />
      );
    
    console.log(bioSlotMarkup)

    return (
      <Container>
        <Row>
          <Col>
            <ProfilePicture
              picture={this.state.picture}
              onChange={this.setProfilePicture}
            />
          </Col>
          <Col>
            {nameSlotMarkup}
            {bioSlotMarkup}
          </Col>
        </Row>
        <Row>
          {this.state.webId !== "" ? (
            <Button onClick={this.logout.bind(this)}>Logout</Button>
          ) : (
            ""
          )}
        </Row>
      </Container>
    );
  }
}

export default Profile;
