import React, { Component } from "react";
import get_Picture from "../../helpers/user_profile_servies";
import noti_styles from './NotificationsTab.module.css'
import { connect } from "react-redux";

export class Notifications extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       
    }

    this._onNotificationTabClick = this._onNotificationTabClick.bind(this)
  }

  _onNotificationTabClick(from){
    
    // this.props.setIsNotifierGroup(false);
    // this.props.updateLastSeen(new Date())
  }

  createTextMessageNitification(from, messageText){ return (<><h4 onClick={()=>this._onNotificationTabClick(from)} className={noti_styles.notifiitem_heading}><b>{from}</b> Send a new message</h4>
            <p className={noti_styles.notifiitem_paragraph}>{messageText}</p></>)}


  createFileMessageNitification(from, props){     
    return (<><h4 className={noti_styles.notifiitem_heading}><b>{from}</b> Sent you an {props.message.msg.files? "File":"Image"}</h4>
    {/* <p className={noti_styles.notifiitem_paragraph}>{from}</p> */}
    {props.message.msg.images && <img src={props.message.msg.images[0]}></img>}
    {props.message.msg.files && <p className={noti_styles.notifiitem_paragraph}>You have an file Attachement</p>}
    </>)}

  render() {
      return ( 
        <div className={noti_styles.notifiitem} onClick={()=>this.props.fetchChatHistory(this.props.conversation_id)}>
          <img className={noti_styles.notifiitem_img} src={get_Picture(this.props.message.from)} alt="img" />
          <div className={noti_styles.noti_content}>
      {this.props.message.msg.text?
       this.createTextMessageNitification(this.props.message.from, this.props.message.msg.text.text)
      :
      this.createFileMessageNitification(this.props.message.from, this.props)
      }
          </div>
        </div>
       
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    set_conversation_id: (id) => {
      dispatch({ type: "CONVERSATION_ID_ACTION", payload: id });
    },
    set_group_id: (id) => {
      dispatch({ type: "GROUP_ID_ACTION", payload: id });
    },
    set_to_participantID: (id) => {
      dispatch({ type: "TO_PARTICIPANT_ID_ACTION", payload: id });
    },
    set_from_participantID: (id) => {
      dispatch({ type: "FROM_PARTICIPANT_ID_ACTION", payload: id });
    },
  };
};

const mapStateToProps = (state) => {
  return {
    logInStatus: state.logInStatus,
    conversationData: state.conversationData
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

