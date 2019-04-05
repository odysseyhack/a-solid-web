import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import "./OverviewPage.css";
import RequestCard from "../../functional_components/RequestCard";

const LDP = rdf.Namespace("http://www.w3.org/ns/ldp#");

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);

    this.addRequest = this.addRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);

    this.state = {
      webId: this.props.webId,
      requests: []
    };
  }

  fetchNotifications(webId){
    let store = rdf.graph();
    let fetcher = new rdf.Fetcher(store);

    let inboxAddress = webId.replace("profile/card#me", "inbox");

    fetcher.load(inboxAddress).then((response) => {
      const notificationAddresses = store.each(rdf.sym(inboxAddress), LDP("contains"));
      console.log(notificationAddresses);
    })
  }

  addRequest(newRequest) {
    const requests = this.state.requests.slice();
    requests.push(newRequest);
    this.setState({ requests: requests });
  }

  removeRequest(input) {
    if (input === parseInt(input, 10)) {
      const requests = this.state.requests.slice();
      requests.splice(input, 1);
      this.setState({ requests: requests });
    } else {
      const requests = this.state.requests.slice();
      const filteredRequests = requests.filter((value, index, arr) => {
        return value !== input;
      });
      this.setState({ requests: filteredRequests });
    }
  }

  getRequests() {
    if (this.state.requests.length === 0) {
      return (
        <div className="requestcards-card-request">
          Looks like you don't have any requests at the moment
        </div>
      );
    } else {
      const requests = this.state.requests;
      return requests.map((item, i) => {
        return (
          <RequestCard
            index={i}
            avatar={"https://via.placeholder.com/40?text=profile+picture"}
            request={item}
          />
        );
      });
    }
  }

  componentDidMount(){
    auth.trackSession((session) => {
      if (!session){
        console.log("You are not logged in...")
      } else {
        this.setState({
          webId: session.webId
        })
      }

      this.fetchNotifications(this.state.webId);
    })
  }

  render() {
    const requests = this.getRequests();
    return (
      <div
        className="grid-container"
        addrequest={this.addRequest}
        removerequest={this.removeRequest}
      >
        <div id="toggle">
          <div>Requests</div>
          <div>Activity</div>
        </div>
        <div className="requestcards">{requests}</div>
      </div>
    );
  }
}

export default OverviewPage;
