import React, { Component } from "react";
import HyperModal from "react-hyper-modal";
import { connect } from "react-redux";
import { close_modal, open_modal } from "../../store/actions/modalStatusAction";
import "./ModalOne.css";
import EnhancedTable from "../chatbot/TableSorted";
import ImageSlider from "../chatbot/ImageSlider";
import StaticCarousel from "../chatbot/carousel/Carousel";
import { createPortal } from "react-dom";
import UserList from "../chatbot/UserList";
import { Button, IconButton } from "@material-ui/core"; 
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import FeedbackForm from "../chatbot/FeedbackForm";
import FeedbackUI from "../chatbot/FeedbackUI";
import LeaveRequestForm from "../chatbot/forms/LeaveRequestForm";

class ModalOne extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);

    this.state = {
      random: 0,
    };
  }

  resetIframe() {
    this.setState({ random: this.state.random + 1 });
  }

  componentDidMount(p, s) {
    //console.log("MODAL ONE MOUNTED \n")
  }

  componentWillUnmount() {
    //console.log("MODAL ONE UNMOUNTED \n")
  }

  openModal() {
    this.props.open_modal();
  }
  closeModal() {
    this.props.close_modal();
  }

  render() {
    return createPortal(
      <HyperModal isOpen={this.props.isOpened} requestClose={this.closeModal}>
        <div
          className="download-button-wrapper"
          style={{
            textAlign: "right",
            margin: "5px",
            marginTop: "-50px",
            marginRight: "60px",
          }}
        >
          {/* <Button
            variant="contained"
            color="primary"
            endIcon={
              <IconButton aria-label="delete" size="small">
                <ArrowDownwardIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Download
          </Button> */}
        </div>

        {this.props.modalType == "iframe" && (
          <iframe
            ref="ref_modal_src"
            key={this.state.random}
            className="modal-wrapper bg-color-white"
            src={this.props.modalUrl}
            frameBorder="0"
            allowFullScreen 
                        
          ></iframe>
        )}

        {this.props.modalType == "pdf" && (
          <embed
            src={this.props.images}
            width="100%"
            height="600px"
            type="application/pdf"
            
          ></embed>
        )}

        {this.props.modalType == "dataList" && <EnhancedTable />}

        {/* {this.props.modalType == "image" && <ImageSlider />}   */}

        {this.props.modalType == "image" && <StaticCarousel></StaticCarousel>}

        {this.props.MyModalType == "logIn" && (
          <UserList on_userSelect={this.props.on_userSelect}></UserList>
        )}

        
 {/* {this.props.modalType == "feedback" && <FeedbackForm logInStatus={this.props.logInStatus}></FeedbackForm>} */}

{this.props.modalType == "feedback" && <FeedbackUI logInStatus={this.props.logInStatus}></FeedbackUI>}

{this.props.modalType == 'leaveForm' && <LeaveRequestForm></LeaveRequestForm>}
      </HyperModal>,
      document.getElementById("chatbot-modal")
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    close_modal: () => {
      dispatch(close_modal);
    },
    open_modal: () => {
      dispatch(open_modal);
      //    setTimeOut(() =>   dispatch(update_botTyping_to_true) , 3000)
    },
  };
};

const mapStateToProps = (state) => {
  return {
    isOpened: state.modalStatus.isOpened,
    modalUrl: state.modalStatus.modal_url,
    modalType: state.modalStatus.modal_type,
    images: state.modalStatus.images,
    logInStatus: state.logInStatus,
    leaveFormData: state.leaveFormData
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ModalOne);
