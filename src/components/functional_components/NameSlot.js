import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const NameSlot = (props) => {
  let nameDisplay = props.editMode ? (
    <FormControl
      placeholder={props.name}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={props.name}
    />
  ) : (
    <p onClick={props.onClick}>
      {props.name}
    </p>
  );

  return (
    <Row
      style={{ border: "solid #FFF 5px", borderRadius: "10", width: "100%" }}
    >
      <Col md="8">
        <Row style={{ width: "100%" }}>{nameDisplay}</Row>
      </Col>
    </Row>
  );
};

export default NameSlot;
