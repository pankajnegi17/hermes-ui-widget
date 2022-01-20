import React, { Component } from "react";
import axios from "axios/index";
import { connect } from "react-redux";
import "./chatlist.css";
import get_Picture from '../../helpers/user_profile_servies'

export class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      no_of_users: 0,
      is_mounted: false,
      sorted_conversationList: [],
    };

    this.onChatSelect = this.onChatSelect.bind(this); 
  }

  onChatSelect(listItem) {  
    if(listItem.group_type == "BOT") {
      this.props.set_talk_to_what("bot")
      return;
    }

    else if(listItem.group_type == "Notifier"){
      this.props.setIsNotifierGroup(true)
    }

    else{
      this.props.setIsNotifierGroup(false)
    }

    this.props.updateLastSeen()
    let l = listItem;
    l.isNew = false; 
    let chat_title = listItem.group_type=="group" ?  listItem.fName : listItem.fName  ;
    //Setting Up ConversationData in redux start
    this.props.set_conversation_id(listItem.id);
    this.props.set_to_participantID(listItem.name);
    this.props.set_group_name(chat_title);
    this.props.set_group_type(listItem.group_type);
    this.props.set_from_participantID(this.props.logInStatus.username);
    //Setting Up ConversationData in redux ends

    //Setting up chat title
    this.props.set_partner_details(chat_title);

    this.props.set_user_profile_pic(listItem.username);
    this.props.set_chat_with(listItem.group_type);
    this.props.toggleChatWindow(true, listItem.id);
  }

  shouldComponentUpdate(pP, pS) {     
    return true;
  }

  componentWillUnmount() { 
  }

  componentDidMount() { 
    // console.warn('<ChaList> Mounted')
    // this.sortConversations(this.props);
  }

  componentWillReceiveProps(nP, nC) {       
    // this.sortConversations(nP);   
  }


  static __getDerivedStateFromProps(props, state) {
    if (props.currentRow !== state.lastRow) {
      return {
        isScrollingDown: props.currentRow > state.lastRow,
        lastRow: props.currentRow,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

 
 

  render() {
    if (!this.props.conversations || this.props.conversations.length == 0) {
      return (
        <div class="row">
          <div class="col s12">
            <p>You do not have any Conversations! Click here To Start</p>
            <a class="btn-floating btn-large cyan pulse">
              <i onClick={this.props._onPlusButtonClick} class="material-icons">
                add
              </i>
            </a>
          </div>
        </div>
      );
    }

    let renderThislist = this.props.conversations.map(
      (listItem, i) => {
        return (
      <li
            class={
              listItem.username == "bot@hermes"
                ? "collection-item avatar bot-chat-list"
                : "collection-item avatar"
            }
            onClick={() => this.onChatSelect(listItem)}
          >
            {/* <i class="material-icons dp48  circle list-avatar-color">
              account_circle
            </i> */}
            <img class="material-icons dp48  circle list-avatar-color" src={get_Picture(listItem.username)}></img>
            <div class="user-list-wrapper">
              <span class="title">{listItem.fName}</span>
            {listItem.username !="notifier@hermes.com" &&  <p>{listItem.name}</p>}
              <a href="#!" class="secondary-content"></a>
              {listItem.isNew == true && (
                <span className="new-message-indicator">{this.props.fresh_notifications.filter(n=>{console.warn(n);return n.conversation_id==listItem.id}).length} New Message</span>
              )}
            </div>
          </li>
        );
      }
    );
    return <React.Fragment>{renderThislist}</React.Fragment>;
  }

  componentWillUnmount() {
    this.setState({ is_mounted: false });
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
    set_group_name: (name)=>{
      dispatch({type:'GROUP_NAME_ACTION', payload:name})
    },
    set_group_type: (type)=>{
      dispatch({type:'GROUP_TYPE_ACTION', payload:type})
    }
  };
};

const mapStateToProps = (state) => {
  return {
    logInStatus: state.logInStatus,
    conversationData: state.conversationData
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
