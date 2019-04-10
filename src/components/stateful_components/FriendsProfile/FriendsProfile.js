import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import { Button } from "yoda-design-system";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FriendsNameSlot from "../../functional_components/FriendsNameSlot/FriendsNameSlot";
import FriendsJobSlot from "../../functional_components/FriendsJobSlot/FriendsJobSlot";
import FriendsProfilePicture from "../../functional_components/FriendsProfilePicture/FriendsProfilePicture";
import FriendsEmailSlot from "../../functional_components/FriendsEmailSlot/FriendsEmailSlot";
import FriendsBioSlot from "../../functional_components/FriendsBioSlot/FriendsBioSlot";
import FriendsTelephoneSlot from "../../functional_components/FriendsTelephoneSlot/FriendsTelephoneSlot";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const RDF = new rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");

class FriendsProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendsWebId: "",
      webId: "",
      name: "",
      picture: "",
      emails: [],
      job: "",
      telephones: [],
      bio: ""
    };
  }

  fetchUser = () => {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        this.setState({ webId: session.webId });
        console.log("You are logged in. Fetching friends data.");

        const store = rdf.graph();
        const fetcher = new rdf.Fetcher(store);

        const friendsWebId = this.state.friendsWebId;

        fetcher.load(friendsWebId).then(() => {
          const name = store.any(rdf.sym(friendsWebId), FOAF("name"));
          const nameValue = name ? name.value : "-";

          const job = store.any(rdf.sym(friendsWebId), VCARD("role"));
          const jobValue = job ? job.value : "-";

          const picture = store.any(rdf.sym(friendsWebId), VCARD("hasPhoto"));
          const pictureValue = picture ? picture.value : "-";

          const bio = store.any(rdf.sym(friendsWebId), VCARD("note"));
          const bioValue = bio ? bio.value : "-";
          console.log(bioValue);

          const emails = store
            .each(rdf.sym(friendsWebId), VCARD("hasEmail"))
            .map(emailBlankId => {
              const email = store.any(rdf.sym(emailBlankId), VCARD("value"));
              const emailValue = email.value;

              const emailType = store.any(rdf.sym(emailBlankId), RDF("type"));
              const emailTypeValue = emailType
                ? emailType.value.split("#")[1] + "-Email"
                : "Email";

              return [emailValue, emailBlankId.value, emailTypeValue];
            });

          const telephones = store
            .each(rdf.sym(friendsWebId), VCARD("hasTelephone"))
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

              return [telephoneValue, telephoneBlankId, telephoneTypeValue];
            });

          this.setState({
            name: nameValue,
            job: jobValue,
            picture: pictureValue,
            bio: bioValue,
            emails: emails,
            telephones: telephones
          });
        });
      }
    });
  };

  componentDidMount() {
    this.setState({
      friendsWebId: window.location.href.split("?")[1].split("=")[1]
    });
    this.fetchUser();
  }

  render() {
    const emailSlotMarkup = this.state.emails.map((email, index) => {
      return <FriendsEmailSlot email={email} key={index} />;
    });

    const telephoneSlotMarkup = this.state.telephones.map(
      (telephone, index) => {
        return <FriendsTelephoneSlot telephone={telephone} key={index} />;
      }
    );

    return (
      <Container>
        <div>
          <Row>
            <Col>
              <FriendsProfilePicture friendsPicture={this.state.picture} />
              <FriendsNameSlot name={this.state.name} />
              <FriendsJobSlot job={this.state.job} />
              <FriendsBioSlot bio={this.state.bio} />
              {emailSlotMarkup}
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

export default FriendsProfile;
