import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";
import Dropdown from "react-bootstrap/Dropdown";

const NameSlot = props => {
  let nameDisplay = props.editMode ? (
    <FormControl
      placeholder={props.name}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={props.name}
    />
  ) : (
    <p onClick={props.onClick}>{props.name}</p>
  );

  return (
    <Row>
      <Col lg="3">
        <Typography variant="subtitle">Name</Typography>
      </Col>
      <Col md="6">
        <Row>{nameDisplay}</Row>
      </Col>
      <Col lg="3">
        <Dropdown size="sm">
          <Dropdown.Toggle variant="secondary">Access</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Public</Dropdown.Item>
            <Dropdown.Item>Private</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default NameSlot;
