import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            webId: ""
        }
    }

    fetchUser(){

    }

    render(){
        return <div></div>
    }
}

export default Profile;