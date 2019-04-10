import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import { Typography } from "yoda-design-system";

const TelephoneSlot = props => {
  const telephone = props.telephone[0].split(":")[1];
  const telephoneType = props.telephone[2]

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

  return (
    <Row
    >
      <Col lg="3">
        <Typography variant="subtitle">{telephoneType}</Typography>
      </Col>
      <Col md="8">
        <Row>{telephoneDisplay}</Row>
      </Col>
    </Row>
  );
};

export default TelephoneSlot;
