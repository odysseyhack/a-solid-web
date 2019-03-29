import React from "react";
import "./OverviewPage.css";
import { Button } from "yoda-design-system";

class OverviewPage extends React.Component {
  getRequests() {
    if (!this.props.requests) {
      return (
        <div className="requestcards-card-request">
          Looks like you don't have any requests at the moment
        </div>
      );
    } else {
      const requests = this.props.requests;
      return requests.map((item, i) => {
        return (
          <div className="requestcards-card" key={i}>
            <img
              src="https://via.placeholder.com/40?text=profile+picture"
              alt="avatar"
            />
            <strong>{item.name}</strong> wants to
            {item.requests.map((request, j) => {
              return (
                <div className="requestcards-card-request" key={j}>
                  {request}
                  <div>
                    <Button variant="outlined">Accept</Button>
                    <Button variant="outlined">Deny</Button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      });
    }
  }

  render() {
    const requests = this.getRequests();
    return (
      <div className="grid-container">
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
