import React, { Component } from "react";
import HyperModal from "react-hyper-modal";
import { connect } from "react-redux";
import {createPortal} from 'react-dom'
import "./zoomModal.css";

class ZoomMeetingModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    this.props.open_modal();
  }
  closeModal() {
    this.props.close_modal();
  }

  render() {
    return (createPortal( <div className="side-window-wrapper">
    <HyperModal
      isOpen={this.props.isOpened}
      requestClose={this.closeModal}
      classes = {{'wrapperClassName':'hyper-modal-wrapper', 'contentClassName': 'hyper-modal-content-wrapper'}}
      // unmountOnClose= {true}
    >
      <iframe
        ref="ref_modal_src"
        className="modal-wrapper"
        src={this.props.modalUrl}
        frameBorder="0"
        allowFullScreen
        allow="camera;microphone"
      ></iframe>
    </HyperModal>
  </div>, document.getElementById('chatbot-zoom-modal'))     
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    close_modal: () => {
      dispatch({ type: "ZOOM_MODAL_STATUS_ACTION", payload: false });
    },
    open_modal: () => {
      dispatch({ type: "ZOOM_MODAL_STATUS_ACTION", payload: true });
      //    setTimeOut(() =>   dispatch(update_botTyping_to_true) , 3000)
    },
  };
};

const mapStateToProps = (state) => {
  return {
    modalUrl: state.zoomModalStatus.modal_url,
    isOpened: state.zoomModalStatus.isOpened,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ZoomMeetingModal);
