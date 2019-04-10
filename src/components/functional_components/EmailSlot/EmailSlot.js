import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import { Typography } from "yoda-design-system";
import Dropdown from "react-bootstrap/Dropdown";

const EmailSlot = props => {
  const email = props.email[0].split(":")[1];
  const emailType = props.email[2];
  const access = props.email[3]

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

  const dropDownMarkup = (access === "public") ? (
    <div>
      <Dropdown.Item disabled>Public</Dropdown.Item>
      <Dropdown.Item>Private</Dropdown.Item>
    </div>
  ) : (
    <div>
      <Dropdown.Item>Public</Dropdown.Item>
      <Dropdown.Item disabled>Private</Dropdown.Item>
    </div>
  )

  return (
    <Row>
      <Col lg="3">
        <Typography variant="subtitle">{emailType}</Typography>
      </Col>
      <Col md="6">
        <Row>{emailDisplay}</Row>
      </Col>
      <Col lg="3">
        <Dropdown size="sm">
          <Dropdown.Toggle variant="secondary">Access</Dropdown.Toggle>
          <Dropdown.Menu>
            {dropDownMarkup}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default EmailSlot;
