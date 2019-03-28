import React from "react";
import "./OverviewPage.css";
import { Button } from "yoda-design-system";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);
  }

  getRequests() {
    const requests = Array(12).fill({
      name: "Malte Sielski",
      requests: ["View your phone number", "Edit your Birthdate"]
    });
    return requests.map(item => {
      return (
        <div className="requestcards-card">
          <img
            src="https://via.placeholder.com/40?text=profile+picture"
            alt="profile picture"
          />
          <strong>{item.name}</strong> wants to
          {item.requests.map(request => {
            return (
              <div className="requestcards-card-request">
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

  render() {
    const requests = this.getRequests();
    return (
      <div className="grid-container">
        <div id="toggle">
          <div>Requests</div> <div>Activity</div>
        </div>
        <div className="requestcards">{requests}</div>
      </div>
    );
  }
}

export default OverviewPage;
