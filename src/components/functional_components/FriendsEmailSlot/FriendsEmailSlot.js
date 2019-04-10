import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import { Typography } from "yoda-design-system";

const FriendsEmailSlot = props => {
  const email = props.email[0].split(":")[1];
  const emailType = props.email[2];

  return (
    <Row>
      <Col lg="3">
        <Typography variant="subtitle">{emailType}</Typography>
      </Col>
      <Col md="9">
        <Row><Typography variant="paragraph">{email}</Typography></Row>
      </Col>
    </Row>
  );
};

export default FriendsEmailSlot;
