import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";
import Dropdown from "react-bootstrap/Dropdown";

const JobSlot = props => {
  let jobDisplay = props.editMode ? (
    <FormControl
      placeholder={props.job}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={props.job}
    />
  ) : (
    <p onClick={props.onClick}>{props.job}</p>
  );

  return (
    <Row>
      <Col lg="3">
        <Typography variant="subtitle">Job</Typography>
      </Col>
      <Col md="6">
        <Row style={{ width: "100%" }}>{jobDisplay}</Row>
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

export default JobSlot;
