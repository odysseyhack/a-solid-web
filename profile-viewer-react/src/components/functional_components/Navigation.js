import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { NavLink } from "react-router-dom"; 
import { Button } from "yoda-design-system";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");

class Navigation extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            webId: "",
            friendToAdd: "",
            canAddFriend: false
        }
    }

    fetchUser() {
        auth.trackSession(session => {
            if (!session) {
              console.log("You are not logged in");
            } else {
              console.log("You are logged in... Fetching your data now");
              this.setState({
                webId: session.webId
              });
            }
        });
    }

    changeFriendToAdd(e) {
        var xhr = new XMLHttpRequest();
        const url = e.target.value
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status === 200){
                    this.setState({
                        friendToAdd: url,
                        canAddFriend: true
                    })
                } else {
                    this.setState({
                        canAddFriend: false
                    })
                }
            }
        }
        const urlRegExp = new RegExp(/(\w+(:\/\/){1})(\w+\.)(\w+\.)(\w+\/)+/g);
        if(urlRegExp.test(e.target.value )){
            xhr.open("GET", url);
            xhr.send();
        }
      }
    
    addFriend() {
        let webId = this.state.webId
        let friendToAdd = this.state.friendToAdd;
        console.log(friendToAdd)
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

    componentDidMount(){
        this.fetchUser();
    }

    render(){
        return (
            <div style={{padding: "2%"}}>
                <Navbar bg="dark" variant="dark" fixed="top">
                    <Navbar.Brand><img src="favicon.ico" width="30" height="30" alt="Solid logo"/></Navbar.Brand>
                    <Nav className="mr-auto">
                        <NavLink to="/">Profile</NavLink>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Enter a friends webId" className="mr-sm-2" onInput={this.changeFriendToAdd.bind(this)}/>
                        {this.state.canAddFriend ? <Button onClick={this.addFriend.bind(this)}>Add Friend</Button> : <Button disabled>Add Friend</Button>}
                    </Form>
                </Navbar>
            </div>
        );
    }
};

export default Navigation; 