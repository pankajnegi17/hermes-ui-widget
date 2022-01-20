import React, { Component } from "react";
import { connect } from "react-redux";
import Chatbot_Talk_To_Bot from "./Chatbot_talk_to_bot.js";
import Chatbot_Talk_To_Human from "./Chatbot_talk_to_human.js";
import "./chatbot.css";
import Draggable from "react-draggable";  
import { Resizable, ResizableBox } from 'react-resizable';
import LoginForm from "./LoginForm";
import ChatBotHeader from "./ChatBotHeader";
import {
  update_botStatus_inactive,
  update_botStatus_active,
} from "../../store/actions/botStatusAction";
class MaximizedChatbot extends Component {
  messagesEnd = "";
  constructor(props) {
    super(props);
    this.state = {};
    this.toggleChatWindowSize = this.toggleChatWindowSize.bind(this);
  }

  toggleChatWindowSize(){
     
    let chatWindow = this.refs.maximizedChatWindow;

    if( chatWindow.style.width== "500px"){
      chatWindow.style.width = "610px"
    }

    else if( chatWindow.style.width== "610px"){
      chatWindow.style.width = "390px"
    }

    else{
      chatWindow.style.width ="500px";
    }
  }

  render() {
    return (
 
            <Draggable handle=".chatbot-header"  bounds= 'parent' > 


            <div className={this.props.isOpened ? "maximizedChatWindow" : "maximizedChatWindow inactive"} ref="maximizedChatWindow">
              <div
                className={
                  this.props.isOpened && this.props.talk_to_what == "bot"
                    ? "effect8 z-depth-5 chatbot-Wrapper active"
                    : "effect8 z-depth-5 chatbot-Wrapper"
                }
              >
             { this.props.isLogIn ?  <Chatbot_Talk_To_Bot
                toggleChatWindowSize={this.toggleChatWindowSize}
                  conversationData={this.props.conversationData}
                ></Chatbot_Talk_To_Bot> : 
                <React.Fragment>
                <ChatBotHeader
                update_botStatus_inactive={this.props.update_botStatus_inactive} 
              />
      
              <div
                id="chatbot"
                className={this.props.isLogIn ? "" : "logIn_form"}
                ref="chat_box_ref" 
              >
                <LoginForm></LoginForm>
                
                </div>
                </React.Fragment>
                
                }
                {/* {  this.props.talk_to_what == "bot" &&   <Chatbot_Talk_To_Bot
                toggleChatWindowSize={this.toggleChatWindowSize}
                  conversationData={this.props.conversationData}
                ></Chatbot_Talk_To_Bot>} */}
              
              </div>
  
              <div
                className={
                  this.props.isOpened && this.props.talk_to_what != "bot"
                    ? "effect8 z-depth-5 chatbot-Wrapper active"
                    : "effect8 z-depth-5 chatbot-Wrapper"
                }
              > 
      {      this.props.isLogIn && <Chatbot_Talk_To_Human
                    toggleChatWindowSize={this.toggleChatWindowSize}  
                    create_Notification = {this.props.create_Notification}               
                    ></Chatbot_Talk_To_Human>}
                {/* {
                this.props.logInStatus.userType !="" && this.props.logInStatus.isLogIn &&
                  <Chatbot_Talk_To_Human
                  toggleChatWindowSize={this.toggleChatWindowSize}                 
                  ></Chatbot_Talk_To_Human>
                  } */}
               
              </div>
            </div> 
       
            
          </Draggable>  
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    set_talk_to_what: talk_to => {
      dispatch({ type: "TALK_TO_WHAT_ACTION", payload: talk_to });
    },
    update_botStatus_inactive: () => {
      dispatch(update_botStatus_inactive);
    },
  };
};

const mapStateToProps = state => {
  return {
    isOpened: state.botStatus.isOpened,
    isLogIn: state.logInStatus.isLogIn,
    talk_to_what: state.talk_to_what.name, 
    logInStatus:state.logInStatus,
    conversationData:state.conversationData,
    isModalOneOpen:state.modalStatus.isOpened,
    isZoomModalopen:state.zoomModalStatus.isOpened
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaximizedChatbot);
