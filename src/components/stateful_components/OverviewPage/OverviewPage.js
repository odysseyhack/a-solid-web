import React from "react";
import rdf from "rdflib";
import auth from "solid-auth-client";
import "./OverviewPage.css";
import RequestCard from "../../functional_components/RequestCard";
import { DH_NOT_SUITABLE_GENERATOR } from "constants";
import { throws } from "assert";

const LDP = rdf.Namespace("http://www.w3.org/ns/ldp#");
const ACT = rdf.Namespace("https://www.w3.org/ns/activitystreams#");

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);

    this.addRequest = this.addRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
    this.fetchNotificationAddresses = this.fetchNotificationAddresses.bind(this);
    this.fetchNotification = this.fetchNotification.bind(this);

    this.state = {
      webId: this.props.webId,
      requests: []
    };
  }

  fetchNotificationAddresses(webId){
    let inboxStore = rdf.graph();
    let inboxFetcher = new rdf.Fetcher(inboxStore);

    let inboxAddress = webId.replace("profile/card#me", "inbox");

    inboxFetcher.load(inboxAddress).then((response) => {
      const notificationAddresses = inboxStore.each(rdf.sym(inboxAddress), LDP("contains"));
      notificationAddresses.forEach((notificationAddress) => {
        const notificationName = notificationAddress.value.split("/")[3]
        this.fetchNotification(inboxAddress + "/" + notificationName)
      })
    })
  }

  fetchNotification(notificationAddress){
    let notificationStore = rdf.graph();
    let notificationFetcher = new rdf.Fetcher(notificationStore);

    notificationFetcher.load(notificationAddress).then((response) => {
      const sender = notificationStore.any(rdf.sym(notificationAddress), ACT("actor"));
      console.log(sender.value)
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

      this.fetchNotificationAddresses(this.state.webId);
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
