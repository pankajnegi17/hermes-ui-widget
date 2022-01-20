import React from "react";
import {
  update_botTyping_to_true,
  update_botTyping_to_false,
} from "../../store/actions/botTypingAction";
import { connect } from "react-redux";
import { close_modal, open_modal } from "../../store/actions/modalStatusAction";
import "./Message.css";
import bot_avatar from "../../images/bot_avatar.jpg";

const openUrlToNewWindow = (url) => {
  window.open(url, "_blank", "newwindow", "width=300,height=250");
};

const openUrlToNewTab = (url) => {
  window.open(url, "_blank");
};

const MinIframe = (props) => {
  return (
    <React.Fragment>
      <div className="col s12 m8 offset-m2 offset-13 msg-outer">
        <div className="card-panel  z-depth-1 custom-card-panel ">
          <div className="row valign-wrapper margin-b-zero  ">
            <div className="col s2 padding-zero avatar-style">
              <img className="bot-avatar-image" src={bot_avatar} />
            </div>

            <div
              className="col s10 msg-content-wrapper message-content-wrapper-bot min-iframe-wrapper border-b-l-one"
              onClick={() => props.open_modal("iframe", props.url)}
              // onClick={()=>openUrlToNewTab(props.url)}
            >
              {props.hideMinWindow ? (
                <React.Fragment>
                  <span className="black-text">{props.text}  <a > 
                      Click here
                    </a> </span>  
                   
                </React.Fragment>
              ) : (
                <iframe
                  key={props.url}
                  src={props.url}
                  className="min-iframe"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isTyping: state.isTyping.isTyping,
    isOpened: state.modalStatus.isOpened,
    modalUrl: state.modalStatus.modal_url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close_modal: () => {
      dispatch(close_modal);
    },
    open_modal: (type, url) => {
      dispatch({ type: "MODAL_TYPE_ACTION", payload: type });
      dispatch({ type: "MODAL_URL_ACTION", payload: url });
      dispatch(open_modal);
    },
    update_botTyping_to_true: () => {
      dispatch(update_botTyping_to_true);
    },
    update_botTyping_to_false: () => {
      dispatch(update_botTyping_to_false);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MinIframe);
