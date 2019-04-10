import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";
import Dropdown from "react-bootstrap/Dropdown";

const JobSlot = props => {
  const job = props.job[0]
  const access = props.job[1]

  let jobDisplay = props.editMode ? (
    <FormControl
      placeholder={job}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={job}
    />
  ) : (
    <p onClick={props.onClick}>{job}</p>
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
        <Typography variant="subtitle">Job</Typography>
      </Col>
      <Col md="6">
        <Row style={{ width: "100%" }}>{jobDisplay}</Row>
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

export default JobSlot;
