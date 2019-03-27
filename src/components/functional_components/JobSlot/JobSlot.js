import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const JobSlot = (props) => {
  let jobDisplay = props.editMode ? (
    <FormControl
      placeholder={props.job}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={props.job}
    />
  ) : (
    <p onClick={props.onClick}>
      {props.job}
    </p>
  );

  return (
    <Row
      style={{ border: "solid #FFF 5px", borderRadius: "10", width: "100%" }}
    >
      <Col md="8">
        <Row style={{ width: "100%" }}>{jobDisplay}</Row>
      </Col>
    </Row>
  );
};

export default JobSlot;
