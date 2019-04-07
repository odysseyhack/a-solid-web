import React from "react";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import { Button } from "yoda-design-system";
import auth from "solid-auth-client";
import rdf from "rdflib";
import Form from "react-bootstrap/Form";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");

class ContactsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      friendToAdd: "",
      canAddFriend: false
    };
  }

  changeFriendToAdd(e) {
    var xhr = new XMLHttpRequest();
    const url = e.target.value;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          this.setState({
            friendToAdd: url,
            canAddFriend: true
          });
        } else {
          this.setState({
            canAddFriend: false
          });
        }
      }
    };
    const urlRegExp = new RegExp(/(\w+(:\/\/){1})(\w+\.)(\w+\.)(\w+\/)+/g);
    if (urlRegExp.test(e.target.value)) {
      xhr.open("GET", url);
      xhr.send();
    }
  }

  addFriend() {
    let webId = this.state.webId;
    let friendToAdd = this.state.friendToAdd;
    console.log(friendToAdd);
    const store = rdf.graph();
    const updater = new rdf.UpdateManager(store);

    let del = [];
    let ins = rdf.st(
      rdf.sym(webId),
      FOAF("knows"),
      rdf.sym(friendToAdd),
      rdf.sym(webId).doc()
    );
    updater.update(del, ins, (ok, uri, message) => {
      if (ok) console.log("Changes have been applied, reload page to see them");
      else alert(message);
    });
  }

  componentDidMount() {
    auth.trackSession(session => {
      if (session) {
        this.setState({
          webId: session.webId
        });
      }
    });
  }

  render() {
    let addFriendMarkup = this.state.canAddFriend ? (
      <Form inline>
        <FormControl
          type="text"
          placeholder="Enter a friends webId"
          className="mr-sm-2"
          onInput={this.changeFriendToAdd.bind(this)}
        />
        <Button onClick={this.addFriend.bind(this)}>Add Friend</Button>
      </Form>
    ) : (
      <Form inline>
        <FormControl
          type="text"
          placeholder="Enter a friends webId"
          className="mr-sm-2"
          onInput={this.changeFriendToAdd.bind(this)}
        />
        <Button disabled>Add Friend</Button>
      </Form>
    );

    return (
      <Container>
        {this.state.webId ? (
          addFriendMarkup
        ) : (
          <p>You are not logged in...</p>
        )}
      </Container>
    );
  }
}

export default ContactsPage;
