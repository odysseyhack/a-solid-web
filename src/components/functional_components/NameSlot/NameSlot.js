import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typography } from "yoda-design-system";

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
    <Row
    >
      <Col lg="3">
        <Typography variant="subtitle">Name</Typography>
      </Col>
      <Col md="9">
        <Row>{nameDisplay}</Row>
      </Col>
    </Row>
  );
};

export default NameSlot;
