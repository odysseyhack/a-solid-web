import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";

const BioSlot = (props) => {
  let bioDisplay = props.editMode ? (
    <FormControl
      placeholder={props.bio}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={props.bio}
    />
  ) : (
    <p onClick={props.onClick}>{props.bio}</p>
  );

  return (
    <Row
      style={{ border: "solid #FFF 5px", borderRadius: "10", width: "100%" }}
    >
      <Col md="8">
        <Row style={{ width: "100%" }}>{bioDisplay}</Row>
      </Col>
    </Row>
  );
};

export default BioSlot;