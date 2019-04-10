import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";
import Dropdown from "react-bootstrap/Dropdown";

const NameSlot = props => {
  const name = props.name[0]
  const access = props.name[1]

  let nameDisplay = props.editMode ? (
    <FormControl
      placeholder={name}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={name}
    />
  ) : (
    <p onClick={props.onClick}>{name}</p>
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
        <Typography variant="subtitle">Name</Typography>
      </Col>
      <Col md="6">
        <Row>{nameDisplay}</Row>
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

export default NameSlot;
