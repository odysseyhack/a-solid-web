import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import { Typography } from "yoda-design-system";

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
    <div>
      <Row>
      </Row>
      <Row
      >
        <Col lg="3">
          <Typography variant="subtitle">Bio</Typography>
        </Col>
        <Col lg="9">
          <Row>{bioDisplay}</Row>
        </Col>
      </Row>
    </div>
  );
};

export default BioSlot;