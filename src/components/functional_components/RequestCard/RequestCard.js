import React from "react";
import "./RequestCard.css";
import { Button } from "yoda-design-system";

class RequestCard extends React.Component {
  render() {
    const request = this.props.request;
    return (
      <div className="requestcard" key={this.props.index}>
        <div className="requestcard-header">
          <img
            className="requestcard-header-avatar"
            src={this.props.avatar}
            alt="avatar"
          />
          <strong>{request.author}</strong> wants to:
        </div>
        {request.permissions.map((permission, j) => {
          return (
            <div className="requestcard-request" key={j}>
              {permission}
              <div>
                <Button
                  className="requestcard-request-button"
                  variant="outlined"
                >
                  Accept
                </Button>
                <Button
                  className="requestcard-request-button"
                  variant="outlined"
                >
                  Deny
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default RequestCard;
