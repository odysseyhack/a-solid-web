import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Typography} from "yoda-design-system";

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
      <Col md="9">
        <Row style={{ width: "100%" }}>{jobDisplay}</Row>
      </Col>
    </Row>
  );
};

export default JobSlot;
