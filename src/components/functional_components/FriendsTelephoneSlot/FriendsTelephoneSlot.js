import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";

const FriendsTelephoneSlot = props => {
  const telephone = props.telephone[0].split(":")[1];
  const telephoneType = props.telephone[2];

  return (
    <Row>
      <Col lg="3">
        <Typography variant="subtitle">{telephoneType}</Typography>
      </Col>
      <Col md="9">
        <Row><Typography variant="paragraph">{telephone}</Typography></Row>
      </Col>
    </Row>
  );
};

export default FriendsTelephoneSlot;
