import React, { Component } from "react";
import HeroSection from "../HeroSection/HeroSection";
import ModalNotificationView from "../ModalNotification/ModalNotificationView";
import { Container, Button, Row } from "react-bootstrap";
import rdf from "rdflib";
import auth from "solid-auth-client";

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      webId: ""
    };
  }

  fetchUser = () => {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        const webId = session.webId;
        console.log(webId);

        const store = rdf.graph();

        this.setState({
          webId: webId
        });
      }
    });
  };

  toggleModal() {
    if (!this.state.modalShow) {
      this.sendNotification();
    }
    this.setState({ modalShow: !this.state.modalShow });
  }

  sendNotification = () => {
    const inboxAddress = this.state.webId.replace("profile/card#me", "inbox");

    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    let createTurtle = `
        @prefix : <#>.
        @prefix inbox: <./>.
        @prefix solid: <http://www.w3.org/ns/solid/terms#>.
        @prefix as: <http://www.w3.org/ns/activitystreams#>.
        @prefix PREQ: <https://a-solid-web.github.io/permission-ontology/permissionrequests.rdf#> .
        
        <> a solid:Notification , as:Announce, PREQ:DataRequest;
          PREQ:requestDataType PREQ:HealthData;
          PREQ:requests <https://ludwigschubert.solid.community/private/health>;
          PREQ:requestFrom <https://malte18.solid.community/profile/card#me>.
        `;

    //When deleting use DELETE instead of INSERT
    const options = {
      noMeta: true,
      contentType: "text/turtle",
      body: createTurtle
    };
    fetcher.webOperation("POST", inboxAddress, options);
  };

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    return (
      <Container>
        <HeroSection />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Row>
            <h1>Send me your X-Ray Data!</h1>
          </Row>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Row>
            <Button variant="primary" onClick={this.toggleModal.bind(this)}>
              Give Permission with SOIL
            </Button>
          </Row>
        </div>
        <ModalNotificationView
          show={this.state.modalShow}
          onHide={this.toggleModal.bind(this)}
          style={{display:"flex", width:"100%", height:"100%", justifyContent:'center', alignItems:'center'}}
        />
      </Container>
    );
  }
}

export default Start;
