import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";

const FriendsBioSlot = props => {
  return (
    <Row>
      <Col lg="3">
        <Typography variant="subtitle">Bio</Typography>
      </Col>
      <Col md="9">
        <Row>
            <Typography variant="paragraph">{props.bio}</Typography>
        </Row>
      </Col>
    </Row>
  );
};

export default FriendsBioSlot;
