import React from "react";
import Container from "react-bootstrap/Container";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
    };
  }

  render() {
    return (
      <Container>
        {this.props.webId ? (
          <div>
            Hello World!
          </div>
        ) : (
          <p>You are not logged in...</p>
        )}
      </Container>
    );
  }
}

export default Profile;
