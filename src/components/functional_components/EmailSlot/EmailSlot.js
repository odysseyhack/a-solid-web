import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import { Typography } from "yoda-design-system";

const EmailSlot = props => {
  const email = props.email[0].split(":")[1];
  const emailType = props.email[2];

  let emailDisplay = props.editMode ? (
    <FormControl
      placeholder={email}
      id={props.email[1]}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={email}
    />
  ) : (
    <p onClick={props.onClick}>{email}</p>
  );

  return (
    <Row
    >
      <Col lg="3">
        <Typography variant="subtitle">{emailType}</Typography>
      </Col>
      <Col md="9">
        <Row>{emailDisplay}</Row>
      </Col>
    </Row>
  );
};

export default EmailSlot;
