import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";

const FriendsJobSlot = props => {
  return (
    <Row>
      <Col lg="3">
        <Typography variant="subtitle">Job</Typography>
      </Col>
      <Col md="9">
        <Row>
            <Typography variant="paragraph">{props.job}</Typography>
        </Row>
      </Col>
    </Row>
  );
};

export default FriendsJobSlot;
