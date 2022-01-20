import React, { Component, lazy } from "react";
import { connect } from "react-redux";
//import Chatbot from './chatbot/Chatbot';
import MinimizedChatbot from "../components/chatbot/MinimizedChatbot";
import ModalOne from "./modals/ModalOne";
import ZoomMeetingModal from "./modals/ZoomMeetingModal";
import uuid from "react-uuid";
import "./App.css";
import MaximizedChatbot from "./chatbot/MaximizedChatbot";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store as nonistore } from "react-notifications-component";
import { createPortal } from "react-dom";
import { close_modal, open_modal } from "../store/actions/modalStatusAction";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      open: true,
    };
    this.on_userSelect = this.on_userSelect.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  create_Notification(data) {
    nonistore.addNotification(data);
  }

  handleClose() {
    this.setState({ open: false });
  }

  componentWillMount() {
    // this.props.open_agent_chat_with_user_date({
    //   firstName: "Thomas",
    //   lastName: "Murray",
    //   userType: "client",
    //   username: "thomas@hermes.com",
    // });
    const sessionID = uuid();
    this.props.set_session_details(sessionID);
  }

  componentDidMount() { 
    //Creating session details
  }

  on_userSelect(user) {
    this.props.open_agent_chat_with_user_date(user);
    this.props.close_modal();
    this.setState({ loggedIn: true });
  }

  render() { 
    return (
      <React.Fragment>
        {createPortal(
          <ReactNotification />,
          document.getElementById("portal_chatbot_notification")
        )}
        <MaximizedChatbot
          create_Notification={this.create_Notification}
        ></MaximizedChatbot>
        <MinimizedChatbot />
        {this.props.isOpened && <ModalOne />}
        <ZoomMeetingModal />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    open_agent_chat_with_user_date: (logInData) => {
      dispatch({ type: "LOGIN_SUCCESS_ACTION", payload: logInData });
    },
    set_session_details: (sessionDetails) => {
      dispatch({ type: "SESSION_DETAIL_ACTION", payload: sessionDetails });
    },
    close_modal: () => {
      dispatch(close_modal);
    },
  };
};

const mapStateToProps = (state) => {
  return {
    isOpened: state.modalStatus.isOpened,
    logInStatus: state.logInStatus,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
