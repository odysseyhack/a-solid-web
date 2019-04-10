import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import { Button } from "yoda-design-system";
import Container from "react-bootstrap/Container";
import ProfilePicture from "../../functional_components/ProfilePicture";
import NameSlot from "../../functional_components/NameSlot";
import BioSlot from "../../functional_components/BioSlot";
import EmailSlot from "../../functional_components/EmailSlot";
import TelephoneSlot from "../../functional_components/TelephoneSlot";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import JobSlot from "../../functional_components/JobSlot";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const RDF = new rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      name: [],
      picture: "",
      emails: [],
      job: [],
      bio: [],
      telephones: [],
      newName: "",
      editName: false,
      newBio: "",
      editBio: false,
      newEmail: "",
      editEmail: false,
      newTelephone: "",
      editTelephone: false,
      newJob: "",
      editJob: false
    };
  }

  fetchUser = () => {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        const webId = session.webId;
        const privateCard = webId.replace("profile", "private")

        const store = rdf.graph();
        const fetcher = new rdf.Fetcher(store);
        const updater = new rdf.UpdateManager(store);

        fetcher.load(webId).then(() => {
          const names = store.each(rdf.sym(webId), FOAF("name")).map(name => {
            return [name.value, "public"];
          });

          const picture = store.any(rdf.sym(webId), VCARD("hasPhoto"));
          const pictureValue = picture ? picture.value : "";

          const jobs = store.each(rdf.sym(webId), VCARD("role")).map(job => {
            return [job.value, "public"];
          });

          const bios = store.each(rdf.sym(webId), VCARD("note")).map(bio => {
            return [bio.value, "public"];
          });

          const emails = store
            .each(rdf.sym(webId), VCARD("hasEmail"))
            .map(emailBlankId => {
              const email = store.any(rdf.sym(emailBlankId), VCARD("value"));
              const emailValue = email.value;

              const emailType = store.any(rdf.sym(emailBlankId), RDF("type"));
              const emailTypeValue = emailType
                ? emailType.value.split("#")[1] + "-Email"
                : "Email";

              return [emailValue, emailBlankId.value, emailTypeValue, "public"];
            });

          const telephones = store
            .each(rdf.sym(webId), VCARD("hasTelephone"))
            .map(telephoneBlankId => {
              const telephone = store.any(
                rdf.sym(telephoneBlankId),
                VCARD("value")
              );
              const telephoneValue = telephone.value;

              const telephoneType = store.any(
                rdf.sym(telephoneBlankId),
                RDF("type")
              );
              const telephoneTypeValue = telephoneType
                ? telephoneType.value.split("#")[1] + "-Phone"
                : "Phone";

              return [
                telephoneValue,
                telephoneBlankId,
                telephoneTypeValue,
                "public"
              ];
            });

          this.setState({
            webId: webId,
            name: names,
            picture: pictureValue,
            emails: emails,
            job: jobs,
            bio: bios,
            telephones: telephones,
            newName: names[0],
            editMode: false
          });
        });

        fetcher.load(privateCard).then(() => {
          console.log("privateCard exists")
        }).catch((err) => {
          let newPrivateProfile;
          newPrivateProfile = [
            rdf.st(rdf.sym(privateCard), RDF("type"), FOAF("Person"))
          ]
          updater.put(rdf.sym(privateCard), newPrivateProfile, "text/turtle", function(uri, ok, message) {
            if(ok) console.log("New Private Card has been created");
            else console.log(message);
          })  
        })
      }
    });
  };

  setProfilePicture = e => {
    var filePath = e.target.files[0];
    var store = rdf.graph();
    var fetcher = new rdf.Fetcher(store);

    let webId = this.props.webId;
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

  applyNameChanges(e) {
    const oldName = e.target.placeholder;
    const store = rdf.graph();
    const updater = new rdf.UpdateManager(store);

    var del;
    var ins;

    del = rdf.st(
      rdf.sym(this.props.webId),
      FOAF("name"),
      rdf.lit(oldName),
      rdf.sym(this.props.webId).doc()
    );
    ins = rdf.st(
      rdf.sym(this.props.webId),
      FOAF("name"),
      rdf.lit(this.state.newName),
      rdf.sym(this.props.webId).doc()
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

  applyBioChanges(e) {
    const oldBio = e.target.placeholder;
    const store = rdf.graph();
    const updater = new rdf.UpdateManager(store);

    var del;
    var ins;

    del = rdf.st(
      rdf.sym(this.props.webId),
      VCARD("note"),
      rdf.lit(oldBio),
      rdf.sym(this.props.webId).doc()
    );
    ins = rdf.st(
      rdf.sym(this.props.webId),
      VCARD("note"),
      rdf.lit(this.state.newBio),
      rdf.sym(this.props.webId).doc()
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

  applyEmailChanges(e) {
    if (this.state.newEmail !== "") {
      const oldEmail = e.target.placeholder;
      const oldEmailBlankId = e.target.id;

      const store = rdf.graph();
      const updater = new rdf.UpdateManager(store);

      var del;
      var ins;

      del = rdf.st(
        rdf.sym(oldEmailBlankId),
        VCARD("value"),
        rdf.sym("mailto:" + oldEmail),
        rdf.sym(this.state.webId).doc()
      );
      ins = rdf.st(
        rdf.sym(oldEmailBlankId),
        VCARD("value"),
        rdf.sym("mailto:" + this.state.newEmail),
        rdf.sym(this.state.webId).doc()
      );

      var updatePromise = new Promise((resolve, reject) => {
        updater.update(del, ins, (uri, ok, message) => {
          if (ok) {
            resolve();
          } else reject(message);
        });
      });
      updatePromise.then(() => {
        this.setState({ editEmail: false });
        this.fetchUser();
      });
    } else {
      this.setState({ editEmail: false });
    }
  }

  getNewEmail(e) {
    this.setState({ newEmail: e.target.value });
  }

  toggleEditEmail() {
    this.setState({ editEmail: !this.state.editEmail });
  }

  applyJobChanges(e) {
    const oldJob = e.target.placeholder;
    const store = rdf.graph();
    const updater = new rdf.UpdateManager(store);

    var del;
    var ins;

    del = rdf.st(
      rdf.sym(this.props.webId),
      VCARD("role"),
      rdf.lit(oldJob),
      rdf.sym(this.props.webId).doc()
    );
    ins = rdf.st(
      rdf.sym(this.props.webId),
      VCARD("role"),
      rdf.lit(this.state.newJob),
      rdf.sym(this.props.webId).doc()
    );

    var updatePromise = new Promise((resolve, reject) => {
      updater.update(del, ins, (uri, ok, message) => {
        if (ok) {
          resolve();
        } else reject(message);
      });
    });
    updatePromise.then(() => {
      this.setState({ editJob: false });
      this.fetchUser();
    });
  }

  getNewJob(e) {
    this.setState({ newJob: e.target.value });
  }

  toggleEditJob() {
    this.setState({ editJob: !this.state.editJob });
  }

  applyTelephoneChanges(e) {
    if (this.state.newTelephone !== "") {
      const oldTelephone = e.target.placeholder;
      const oldTelephoneBlankId = e.target.id;

      const store = rdf.graph();
      const updater = new rdf.UpdateManager(store);

      var del;
      var ins;

      del = rdf.st(
        rdf.sym(oldTelephoneBlankId),
        VCARD("value"),
        rdf.sym("tel:" + oldTelephone),
        rdf.sym(this.state.webId).doc()
      );
      ins = rdf.st(
        rdf.sym(oldTelephoneBlankId),
        VCARD("value"),
        rdf.sym("tel:" + this.state.newTelephone),
        rdf.sym(this.state.webId).doc()
      );

      var updatePromise = new Promise((resolve, reject) => {
        updater.update(del, ins, (uri, ok, message) => {
          if (ok) {
            resolve();
          } else reject(message);
        });
      });
      updatePromise.then(() => {
        this.setState({ editTelephone: false });
        this.fetchUser();
      });
    } else {
      this.setState({ editTelephone: false });
    }
  }

  getNewTelephone(e) {
    this.setState({ newTelephone: e.target.value });
  }

  toggleEditTelephone() {
    this.setState({ editTelephone: !this.state.editTelephone });
  }

  toggleTelephoneAccess(e) {
    const telephoneBlankId = e.target.id.split("?")[0];
    const telephoneValue = e.target.id.split("?")[1];
    const telephoneDoc = telephoneBlankId.split("#")[0];
    console.log(telephoneDoc);

    const store = rdf.graph();
    const updater = new rdf.UpdateManager(store);

    const access = e.target.innerHTML;

    if (access === "public") {
      const del = [
        rdf.st(
          rdf.sym(telephoneDoc),
          VCARD("hasTelephone"),
          rdf.lit(telephoneValue),
          rdf.sym(telephoneDoc).doc()
        )
      ];

      const ins = [
        rdf.st(
          rdf.sym(telephoneDoc),
          VCARD("hasTelephone"),
          rdf.lit("Request Access"),
          rdf.sym(telephoneDoc).doc()
        ),
        rdf.st(
          rdf.sym(telephoneDoc),
          VCARD("hasTelephone"),
          rdf.lit("Request Access"),
          rdf.sym(telephoneDoc.replace("profile", "private")).doc()
        )
      ];

      updater.update(del, ins, (uri, ok, message) => {
        if (ok) console.log("Made public");
        else alert(message);
      })
    } else if (access === "private"){
      const del = [
        rdf.st(
          rdf.sym(telephoneDoc),
          VCARD("hasTelephone"),
          rdf.lit("Request Access"),
          rdf.sym(telephoneDoc).doc()
        ),
        rdf.st(
          rdf.sym(telephoneDoc),
          VCARD("hasTelephone"),
          rdf.lit(telephoneValue),
          rdf.sym(telephoneDoc.replace("profile", "private")).doc()
        )
      ];

      const ins = [
        rdf.st(
          rdf.sym(telephoneDoc),
          VCARD("hasTelephone"),
          rdf.lit(telephoneValue),
          rdf.sym(telephoneDoc).doc()
        )
      ];
      
      updater.update(del, ins, (uri, ok, message) => {
        if (ok) console.log("Made public");
        else alert(message);
      })
    }
  }

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    let nameSlotMarkup = this.state.name.map((name, index) => {
      return (
        <NameSlot
          name={name}
          key={index}
          editMode={this.state.editName}
          onBlur={this.applyNameChanges.bind(this)}
          onChange={this.getNewName.bind(this)}
          onClick={this.toggleEditName.bind(this)}
        />
      );
    });

    let jobSlotMarkup = this.state.job.map((job, index) => {
      return (
        <JobSlot
          job={job}
          key={index}
          editMode={this.state.editJob}
          onBlur={this.applyJobChanges.bind(this)}
          onChange={this.getNewJob.bind(this)}
          onClick={this.toggleEditJob.bind(this)}
        />
      );
    });

    let bioSlotMarkup = this.state.bio.map((bio, index) => {
      return (
        <BioSlot
          bio={bio}
          key={index}
          editMode={this.state.editBio}
          onBlur={this.applyBioChanges.bind(this)}
          onChange={this.getNewBio.bind(this)}
          onClick={this.toggleEditBio.bind(this)}
        />
      );
    });

    let emailSlotsMarkup = this.state.emails.map((email, index) => {
      return (
        <EmailSlot
          key={index}
          email={email}
          editMode={this.state.editEmail}
          onChange={this.getNewEmail.bind(this)}
          onClick={this.toggleEditEmail.bind(this)}
          onBlur={this.applyEmailChanges.bind(this)}
        />
      );
    });

    let telephoneSlotsMarkup = this.state.telephones.map((telephone, index) => {
      return (
        <TelephoneSlot
          key={index}
          telephone={telephone}
          editMode={this.state.editTelephone}
          onChange={this.getNewTelephone.bind(this)}
          onClick={this.toggleEditTelephone.bind(this)}
          onBlur={this.applyTelephoneChanges.bind(this)}
          onToggleAccess={this.toggleTelephoneAccess}
        />
      );
    });

    return (
      <Container>
        {this.props.webId ? (
          <div>
            <Row>
              <Col>
                <ProfilePicture
                  picture={this.state.picture}
                  onChange={this.setProfilePicture}
                />
              </Col>
              <Col>
                {nameSlotMarkup}
                {jobSlotMarkup}
                {bioSlotMarkup}
                {emailSlotsMarkup}
                {telephoneSlotsMarkup}
              </Col>
            </Row>
            <Row>
              <Button onClick={this.props.logout}>Logout</Button>
            </Row>
          </div>
        ) : (
          <p>You are not logged in...</p>
        )}
      </Container>
    );
  }
}

export default Profile;
