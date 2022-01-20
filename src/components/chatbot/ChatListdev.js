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
    this.sortConversations = this.sortConversations.bind(this);
  }

  onChatSelect(listItem) { 
    this.props.updateLastSeen(new Date())
    let l = listItem;
    l.isNew = false;
    let selected_conversation_index = this.state.sorted_conversationList.findIndex(
      (p) => p.id == l.id
    );

    let sorted_conversationList = this.state.sorted_conversationList;
    sorted_conversationList[selected_conversation_index] = l;
    this.setState({ sorted_conversationList: sorted_conversationList });
    let chat_title = listItem.group_type=="group" ?  "Hi! "+this.props.logInStatus.firstName : listItem.fName  ;
    this.props.set_partner_details(chat_title);
    this.props.set_conversation_id(listItem.id);
    this.props.set_from_participantID(this.props.logInStatus.username);
    this.props.set_to_participantID(listItem.name);
    this.props.set_user_profile_pic(listItem.username);
    this.props.set_chat_with(listItem.group_type, listItem.username);
    this.props.toggleChatWindow(true, listItem.id);
  }

  compo

  componentWillReceiveProps(nP, nC) {  
    this.sortConversations(nP);  
  }

 componentDidMount(){ 
  //  console.log("/t&&&&&&&&&&&&&&&&&&&&&&&&&&&ChatList Componenet mounted&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\t")
 }

  sortConversations(newProps) {   
      let ac =newProps.conversations;
      // console.log("\n\n\t\n\n",ac)    
      //Setting latest conversation on top
      if (ac &&
        ac.length > 0 && 
        this.props.conversations.length > 0 &&
        this.props.latest_conversation != ""
      ) {
        let latest_conversation_index = ac.findIndex(
          (p) => p.id == this.state.sorted_conversationList
        );
        let latestConersation = ac[latest_conversation_index];
        let tempAtzero = ac[0];
        for (let i = latest_conversation_index; i > 0; i--) {
          ac[i] = ac[i - 1];
        }
        // latestConersation.isNew = true;
        ac[0] = latestConersation;
      }
 

      else if (ac && ac.length > 0 ) {

        // console.log(`\n%%%%%%%%%%%%% ac= %%%%%[ BEFORE ]%%%%%%%%%`, ac)
        
          //Setting HERMES on top
        let hermes_conversation_index = ac.findIndex(
          (p) => p.username == "bot@hermes"
        );
        if(hermes_conversation_index != -1){
          let conversationWithHermes = ac[hermes_conversation_index];

          ac.splice(hermes_conversation_index, hermes_conversation_index+1);
          ac.unshift(conversationWithHermes);
          // console.log(`\n%%%%%%%%%%%%% ac= %%%%%%[AFTER ]%%%%%%%%`, ac)
          
        }


        //Setting NOTIFICATION ON TOP
         // Setting notification on Top
      let notification_tab_index = ac.findIndex(
        (p) => p.username == "notifier@hermes.com"
      );
      if(notification_tab_index != -1){
        let conversationWithNotifier= ac[notification_tab_index];

        ac.splice(notification_tab_index, notification_tab_index+1);
        ac.unshift(conversationWithNotifier);
        // console.log(`\n%%%%%%%%%%%%% ac= %%%%%%[AFTER ]%%%%%%%%`, ac)
        
      }

        else{
          // console.log(`\n%%%%%%%%%%%% NOTHING TO UNSHIFT %%%%%%%%%%%%%%%`, )
        }
      }

     

 

  
      // if (!(this.state.sorted_conversationList == ac)) {
      //   this.setState({ sorted_conversationList: ac });
      // }  
      this.setState({ sorted_conversationList: ac })

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

    let renderThislist = this.state.sorted_conversationList.map(
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
              <p>{listItem.name}</p>
              <a href="#!" class="secondary-content"></a>
              {listItem.isNew == true && (
                <span className="new-message-indicator">New Message </span>
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
  };
};

const mapStateToProps = (state) => {
  return {
    logInStatus: state.logInStatus,
    conversationData: state.conversationData
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
