import React from "react";
import Container from "react-bootstrap/Container";
import { Button, List, TextField } from "yoda-design-system";
import auth from "solid-auth-client";
import rdf from "rdflib";
import ContactSlot from "../../functional_components/ContactSlot/ContactSlot";

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
      friends: []
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

    fetcher.load(webId).then(response => {
      const friendsWebId = store.each(rdf.sym(webId), FOAF("knows"));
    
      const friends = friendsWebId.map(friend => {
        return fetcher.load(friend.value).then(() => {
        console.log("Fetched " + friend.value + "'s Profile");
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
        return {
            name: friendName.value,
            webId: friend.value,
            access: friendAccess,
            picture: friendPicture
        };
        });
      });
      Promise.all(friends).then((results) => {
          this.setState({ friends: results });
      })
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
      <div>
        <TextField
          description="Enter a friends webId"
          onInput={this.changeFriendToAdd.bind(this)}
        />
        <Button onClick={this.addFriend.bind(this)}>Add Friend</Button>
      </div>
    ) : (
      <div>
        <TextField
          type="text"
          description="Enter a friends webId"
          onInput={this.changeFriendToAdd.bind(this)}
        />
        <Button disabled>Add Friend</Button>
      </div>
    );
    const friends = this.state.friends;
    const friendsMarkup = friends.map((friend, index) => {
        return <ContactSlot friend={friend} key={index}></ContactSlot>
    });
    return (
      <Container>
        <List>{friendsMarkup}</List>
        {this.state.webId ? addFriendMarkup : <p>You are not logged in...</p>}
      </Container>
    );
  }
}

export default ContactsPage;
