import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";

const EmailSlot = (props) => {
  const email = props.email[0].split(":")[1]

  let emailDisplay = props.editMode ? (
    <FormControl
      placeholder={email}
      id={props.email[1]}
      onChange={props.onChange}
      onBlur={props.onBlur}
      defaultValue={email}
    />
  ) : (
    <p onClick={props.onClick}>{email}</p>
  );

  return (
    <Row
      style={{ border: "solid #FFF 5px", borderRadius: "10", width: "100%" }}
    >
      <Col md="8">
        <Row style={{ width: "100%" }}>{emailDisplay}</Row>
      </Col>
    </Row>
  );
};

export default EmailSlot;
