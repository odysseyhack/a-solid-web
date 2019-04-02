import React from "react";
import "./OverviewPage.css";
import { Button } from "yoda-design-system";
import RequestCard from "../../functional_components/RequestCard";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);

    this.addRequest = this.addRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);

    this.state = {
      requests: this.props.requests ? this.props.requests : []
    };
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

  render() {
    const requests = this.getRequests();
    return (
      <div
        className="grid-container"
        addRequest={this.addRequest}
        removeRequest={this.removeRequest}
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
