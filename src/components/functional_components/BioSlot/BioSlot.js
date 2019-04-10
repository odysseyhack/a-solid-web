import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import { Typography } from "yoda-design-system";
import Dropdown from "react-bootstrap/Dropdown";

const BioSlot = props => {
  const bio = props.bio[0];
  const access = props.bio[1];

  let bioDisplay = props.editMode ? (
    <FormControl
      placeholder={bio}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={bio}
    />
  ) : (
    <p onClick={props.onClick}>{bio}</p>
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
    <div>
      <Row />
      <Row>
        <Col lg="3">
          <Typography variant="subtitle">Bio</Typography>
        </Col>
        <Col lg="6">
          <Row>{bioDisplay}</Row>
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
    </div>
  );
};

export default BioSlot;
