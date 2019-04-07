import React from "react";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import { Button } from "yoda-design-system";
import auth from "solid-auth-client";
import rdf from "rdflib";
import Form from "react-bootstrap/Form";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const ACL = new rdf.Namespace("http://www.w3.org/ns/auth/acl#");

class ContactsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      friendToAdd: "",
      canAddFriend: false,
      friends: undefined
    };
  }

  fetchFriends() {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const webId = this.state.webId;

    const permissionStore = rdf.graph();
    const permissionFetcher = new rdf.Fetcher(permissionStore);

    let viewerNode = webId.replace("card#me", "card.acl#viewer");
    permissionFetcher.load(viewerNode);

    fetcher.load(this.state.webId).then(response => {
      const friendsWebId = store.each(rdf.sym(this.state.webId), FOAF("knows"));

      var friends = [];
      friendsWebId.forEach(friend => {
        var friendsPromise = new Promise(function(resolve, reject) {
          fetcher.load(friend.value).then(() => {
            console.log("Fetched " + friend.value + "'s Profile");
            resolve(friend);
          });
        });
        friendsPromise.then(function(friend) {
          const friendName = store.any(rdf.sym(friend.value), FOAF("name"));

          var friendPicture = store.any(
            rdf.sym(friend.value),
            VCARD("hasPhoto")
          );
          friendPicture = friendPicture ? friendPicture.value : "";

          const friendAccess =
            permissionStore.statementsMatching(
              viewerNode,
              ACL("agent"),
              rdf.sym(friend.value)
            ).length > 0
              ? true
              : false;
          //console.log(friend.value, friendAccess)
          friends.push({
            name: friendName.value,
            webId: friend.value,
            access: friendAccess,
            picture: friendPicture
          });
        });
      });
      this.setState({ friends: friends });
    });
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
        this.fetchFriends();
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

    const friendsMarkup = this.state.friends ? "These are my friends" : "I have no friends."

    return (
      <Container>
        {friendsMarkup}
        {this.state.webId ? addFriendMarkup : <p>You are not logged in...</p>}
      </Container>
    );
  }
}

export default ContactsPage;
