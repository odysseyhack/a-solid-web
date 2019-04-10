import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import { Button } from "yoda-design-system";
import Container from "react-bootstrap/Container";
import ProfilePicture from "../../functional_components/ProfilePicture";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import JobSlot from "../../functional_components/JobSlot";
import FriendsNameSlot from "../../functional_components/FriendsNameSlot/FriendsNameSlot";
import FriendsJobSlot from "../../functional_components/FriendsJobSlot/FriendsJobSlot";
import FriendsProfilePicture from "../../functional_components/FriendsProfilePicture/FriendsProfilePicture";



const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class FriendsProfile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            friendsWebId: "",
            webId: "",
            friendsName: "",
            // picture: "",
            // emails: [],
            friendsJob: "",
            friendsBio: ""

        };
    }

    fetchUser = () => {
        auth.trackSession(session => {
            if(!session) {
                console.log("You are not logged in")
            } else {
                this.setState({webId: session.webId});
                console.log("You are logged in. Fetching friends data.")

                const store = rdf.graph(); 
                const fetcher = new rdf.Fetcher(store); 

                const friendsWebId = this.state.friendsWebId;

                fetcher.load(friendsWebId).then(() => {
                    const name = store.any(rdf.sym(friendsWebId), FOAF("name"));
                    const nameValue = name ? name.value : "request Access"; 
                    
                    const job = store.any(rdf.sym(friendsWebId), VCARD("role"));
                    const jobValue = job ? job.value : "request Access"; 

                    const picture = store.any(rdf.sym(friendsWebId), VCARD("hasPhoto"))
                    const pictureValue = picture ? picture.value : "request Access";

                    const bio = store.any(rdf.sym(friendsWebId), VCARD("role"));
                    const bioValue = bio ? bio.value : "request Access"; 
                    console.log(bioValue);


                    const emails = store
                       .each(rdf.sym(webId), VCARD("hasEmail"))
                       .map(emailBlankId => {
                           const email = store.any(rdf.sym(emailBlankId), VCARD("value"));
                           const emailValue = email.value;

                           const emailType = store.any(rdf.sym(emailBlankId), RDF("type"));
                           const emailTypeValue = emailType
                            ? emailType.value.split("#")[1] + "-Email" : "Request Access";

                           return [emailValue, emailBlankId.value, emailTypeValue];
                       }); 
                       


                    this.setState({
                        friendsName: nameValue,
                        friendsJob: jobValue, 
                        friendsPicture: pictureValue,
                        friendsBio: bioValue,
                        emails: emails, 

                    });
                });
            }
        });
    };

    componentDidMount(){
        this.setState({
            friendsWebId: window.location.href.split("?")[1].split("=")[1]
        })
        this.fetchUser(); 
    }

    render(){
        return (
          <Container>
            <div>
                <Row>
                    <Col>
                        <FriendsProfilePicture friendsPicture={this.state.friendsPicture} />
                        <p>{this.state.friendsWebId}</p>
                        <FriendsNameSlot friendsName={this.state.friendsName}/>
                        <FriendsJobSlot friendsJob={this.state.friendsJob} />
                    </Col>
                </Row>
            </div>
          </Container>  
        )
        
    }
}

export default FriendsProfile;