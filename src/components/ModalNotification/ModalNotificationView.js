import React from "react";
import Modal from "react-bootstrap/Modal";
import Iframe from 'react-iframe';

class ModalNotificationView extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Iframe url="https://a-solid-web.github.io/profile-viewer-react/"
        height="800px"
        width="800px"
        position="relative"
        allowFullScreen
        styles={{width: "100%", height: "100%", justifyContent:'center', alignItems:'center'}}/>
      </Modal>
    );
  }
}
export default ModalNotificationView;
