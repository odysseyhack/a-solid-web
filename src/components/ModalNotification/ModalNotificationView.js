import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Iframe from 'react-iframe'

//http://localhost:3006/
class ModalNotificationView extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <iframe src="https://a-solid-web.github.io/profile-viewer-react/" target="_parent" /> */}

        <Iframe url="http://localhost:3006/overview"
        height="800px"
        width="800px"
        // display="initial"
        position="relative"
        allowFullScreen
        styles={{width: "100%", height: "100%", justifyContent:'center', alignItems:'center'}}
        />
        {/* <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Requested Permissions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>hi</Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    );
  }
}
export default ModalNotificationView;
