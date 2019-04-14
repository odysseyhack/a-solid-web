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
      webId: "",
      access: false
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

        this.fetchImage();

        this.setState({
          webId: webId,
          access: false
          
        });
      }
    });
  };

  toggleModal() {
    if (!this.state.modalShow) {
      const source = "https://malte18.solid.community/health/architecture-864367_1920.jpg";
      
      this.httpGetAsync(source); 
      // this.fetchImage();
    }
    if (!this.state.access) {
      this.sendNotification();
      this.checkForAccess();
      
    }
    this.setState({ modalShow: !this.state.modalShow });
  }

  checkForAccess(){
    console.log("check for access");
    console.log(this.state.access);
    // while(this.state.access == false) {
    //   const source = "https://malte18.solid.community/health/architecture-864367_1920.jpg";
    //   setTimeout(this.httpGetAsync(source), 500);
    //   // setTimeout(this.fetchImage(), 1000);
    // }
  }


  httpGetAsync(source){
    var xmlHttp = new XMLHttpRequest();
    console.log("check for access");
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // this.updateAccessState(true);
            this.setState({access: true});
        }
    }
    xmlHttp.open("GET", source, true); // true for asynchronous 
    xmlHttp.send(null);
  } 

  // fetchImage(){
  //   const source = "https://malte18.solid.community/health/architecture-864367_1920.jpg"
  //   fetch(source).then(res => {
  //     console.log("WWWW")
  //     console.log(res)
  //     if (res.status === 401) {
  //       this.setState({access: false});
  //     } else {
  //       this.setState({access: true});
  //     }
  //   });
  // }

  updateAccessState(state) {
    this.setState({access: state})
  }
  sendNotification() {
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
          PREQ:requests <https://malte18.solid.community/health>;
          PREQ:requestFrom <http://localhost:3000>.
        `;

    //When deleting use DELETE instead of INSERT
    const options = {
      noMeta: true,
      contentType: "text/turtle",
      body: createTurtle
    };
    fetcher.webOperation("POST", inboxAddress, options);
    console.log("sent notification");
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
