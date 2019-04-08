import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";

const TelephoneSlot = (props) => {
    const telephone = props.telephone[0].split(":")[1]
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
        <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%"}}>
            <Col md="8">
                <Row style={{width: "100%"}}>
                    {telephoneDisplay}
                </Row>
            </Col>
        </Row>
    )
}

export default TelephoneSlot;