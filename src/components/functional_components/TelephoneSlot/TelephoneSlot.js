import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import { Typography } from "yoda-design-system";
import Dropdown from "react-bootstrap/Dropdown";

const TelephoneSlot = props => {
  const telephone = props.telephone[0].split(":")[1];
  const telephoneType = props.telephone[2];
  const access = props.telephone[3]

  let telephoneDisplay = props.editMode ? (
    <FormControl
      placeholder={telephone}
      id={props.telephone[1]}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={telephone}
    />
  ) : (
    <p onClick={props.onClick}>{telephone}</p>
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
        <Typography variant="subtitle">{telephoneType}</Typography>
      </Col>
      <Col md="6">
        <Row>{telephoneDisplay}</Row>
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

export default TelephoneSlot;
