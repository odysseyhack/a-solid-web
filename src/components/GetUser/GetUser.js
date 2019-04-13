import React from "react"; 
import rdf from "rdflib";
import auth from "solid-auth-client";


class GetUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            webId: ""
        }
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
      }
      
      componentDidMount() {
        this.fetchUser();
      }
      render() {
        return(
            <div>
                {this.state.webId}
            </div>
        );
    }
}

export default GetUser;