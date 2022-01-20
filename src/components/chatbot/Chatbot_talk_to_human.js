import React, { Component } from "react";
import axios from "axios/index";
import "./chatbot.css";
import Message from "./Message";
import Card from "./Card";
import { connect } from "react-redux";
import {
  update_botStatus_inactive,
  update_botStatus_active,
} from "../../store/actions/botStatusAction"; 
import {
  update_botTyping_to_true,
  update_botTyping_to_false,
} from "../../store/actions/botTypingAction";
import { bot_message_added } from "../../store/actions/botMessagesLengthAction";
import uuid from "react-uuid";
import MinIframe from "./MinIframe";
import ChatList from "./ChatList";
import AgentList from "./AgentList";
import ListEmployees from "./ListEmployees";
import ReactNotifications from "react-browser-notifications";
import AttachementMenu from "./AttachementMenu";
import {
  chatbot_api_host,
  nlp_gateway_host,
  nlp_gateway_port,
  zoom_app_host,
  zoom_app_port,
} from "../../config";
import ImageAttachement from "./ImageAttachement";
import get_Picture from "../../helpers/user_profile_servies";
import NotificationsTab from "./NotificationsTab";
import Notifications_Box from './Notificaltions'
import talk_to_human_styles from "./Chatbot_talk_to_human.module.css";

import {sendMessage, sendPrivateMessage,sendNewPrivateMessage, socket1, joinRoom}   from '../../services/socketServices' 
import { open_modal } from "../../store/actions/modalStatusAction";

class Chatbot_Talk_To_Human extends Component {
  messagesEnd = "";
  constructor(props) {
    super(props);
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this.onMessageArrived = this.onMessageArrived.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this._handleSendButton = this._handleSendButton.bind(this);
    this.fetchChatHistory = this.fetchChatHistory.bind(this);
    this.toggleChatWindow = this.toggleChatWindow.bind(this);
    this.toggleDesignation = this.toggleDesignation.bind(this);
    this._onEmployeeListBackButton = this._onEmployeeListBackButton.bind(this);
    this.talkToSomeOne = this.talkToSomeOne.bind(this);
    this._onPlusButtonClick = this._onPlusButtonClick.bind(this);
    this.toggleShowChat = this.toggleShowChat.bind(this);
    this._onSwitchWindowButtonClick = this._onSwitchWindowButtonClick.bind(this);
    this.fetchConversationList = this.fetchConversationList.bind(this);
    this.send_to_nlp = this.send_to_nlp.bind(this);
    this.sendMessageToDb = this.sendMessageToDb.bind(this);
    this.renderListMessages = this.renderListMessages.bind(this);
    this.set_partner_details = this.set_partner_details.bind(this);
    this.onVideoButtonClick = this.onVideoButtonClick.bind(this);
    this.setGroupContext = this.setGroupContext.bind(this);
    this.getGroupContext = this.getGroupContext.bind(this);
    this.df_text_query = this.df_text_query.bind(this);
    this._toggleAttachButton = this._toggleAttachButton.bind(this);
    this._toggleUploaderMenu = this._toggleUploaderMenu.bind(this);
    this.setUploaderType = this.setUploaderType.bind(this);
    this.onShowAllEmployeesClick = this.onShowAllEmployeesClick.bind(this);
    this.insertHermesConversation = this.insertHermesConversation.bind(this);
    this.set_chat_with = this.set_chat_with.bind(this);
    this.renderChatList = this.renderChatList.bind(this); 
    this.set_user_profile_pic = this.set_user_profile_pic.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateLastSeen = this.updateLastSeen.bind(this);
    this.create_Notification = this.create_Notification.bind(this);
    this.createConversation = this.createConversation.bind(this);
    this._onClearDataButtomClick = this._onClearDataButtomClick.bind(this)
    this.setIsNotifierGroup = this.setIsNotifierGroup.bind(this)
    this.setIsAttachementMenuOpened = this.setIsAttachementMenuOpened.bind(this)
    this.createMessage = this.createMessage.bind(this)
    this.getMessageBody = this.getMessageBody.bind(this)
    this.setConversationPosition = this.setConversationPosition.bind(this)
    this.generateNotificationData = this.generateNotificationData.bind(this)
    this.toggleShow_notification =this.toggleShow_notification.bind(this)
    this._onShow_notificationClick = this._onShow_notificationClick.bind(this)
    this.onNotificationItemClicked = this.onNotificationItemClicked.bind(this);
    this.deleteNotificationDataById = this.deleteNotificationDataById.bind(this);
    this._onCancelButtonClick = this._onCancelButtonClick.bind(this);
    this.onFeedbackSend = this.onFeedbackSend.bind(this)
    // this.hide = this.hide.bind(this);
    // this.show = this.show.bind(this);

    this.state = {
      messages: [],
      showBot: true,
      person_id: "p3",
      conversations: [],
      chat_length: 0,
      is_mounted: true,
      showChat: false,
      no_of_users: 0,
      designationSelected: false,
      openMenu: false,
      employeeList: [],
      partner_name: "",
      sholdUpdate: true,
      isVideoButtonClicked: false,
      groupContext: "group",
      isattachmentMenuOpen: false,
      uploaderType: "",
      isUploaderMenuOpened: false,
      user_profile_pic: "",
      chat_with: "",
      lastSeen: "",
      latest_conversation: "",
      showNotificationOn: "left",
      bn: { title: "", body: "", image: "" },
      searchForDataFromDate: "",
      requestPending: false,
      lazy_loading: { status: false, loading_message: "" },
      partnerMail: "",
      isNotifierGroup: false,
      fresh_notifications:[],
      all_notifications:[],
      show_notification:false,
      newChatInitiated:{status:false, to: null},
      newConversation:{}, 
      isFeedback:false
    };
  }

  onNotificationItemClicked(notification){   
    //Updating ConversationData in Redux start
    this.props.set_group_name(notification.group_name)
    this.props.set_group_type(notification.group_type)
    this.props.set_conversation_id(notification.conversation_id);
    this.props.set_from_participantID(this.props.logInStatus.username);
    this.props.set_to_participantID(notification.fname);    
    //Updating ConversationData in Redux ends

    //Setting up chat Title
    let chat_title = notification.group_type=="group" ?  notification.group_name : notification.fname  ;
    this.set_partner_details(chat_title);

    this.toggleShow_notification(false) 
    this.setIsNotifierGroup(false) 
    this.updateLastSeen()  
    this.set_user_profile_pic(notification.from);
    this.set_chat_with(notification.group_type);

    //Opening chat for conversation id
    this.toggleChatWindow(true, notification.conversation_id);    
    //Remove this item from notification
    this.deleteNotificationDataById(notification.conversation_id)
  }

  deleteNotificationDataById(cid){ 
    let unread_item = this.state.all_notifications.filter(notification=>{
      return notification.conversation_id != cid
    })
    this.setState({all_notifications:unread_item})     
    //Remove fresh_notifications with this cid
    let fresh_notifications = this.state.fresh_notifications.filter(fresh_notification=>{
      return fresh_notification.conversation_id != cid
    })
    this.setState({fresh_notifications:fresh_notifications}, function(){
      
      this.props.set_notification_length(this.state.fresh_notifications.length)
    }.bind(this))
  }

  setIsNotifierGroup(value){    
    this.setState({isNotifierGroup: value})
  }

  setIsAttachementMenuOpened(value){
    this.setState({isattachmentMenuOpen: value})
  }

  updateLastSeen(lastSeen) { 
    if(lastSeen == undefined){
      this.setState({ lastSeen: new Date().toLocaleString('en-US', { hour12: true }) });
      return
    }

    else 
    this.setState({ lastSeen: lastSeen.toLocaleString() });
  }

  /** Group all_notification based on conversation_id */
  generateNotificationData(){    
    let all_notifications = [...this.state.all_notifications] 
   //Filtering out unique conversation_ids from notifications
    var flags = [], output = [], l = all_notifications.length, i;
     let cids = [];
    for( i=0; i<l; i++) {
        if( flags[all_notifications[i].conversation_id]){        
          continue;
        } 
        flags[all_notifications[i].conversation_id] = true;
        
        cids.push(all_notifications[i].conversation_id)  
        output.push(all_notifications[i]);         
    } 
    let notificationData = output.map( notification=>{
      return {...notification, count:this.state.fresh_notifications.filter(n=>n.conversation_id == notification.conversation_id).length+1}
     

      function getOccurrence(array, value) {
        return array.filter((v) => (v === value)).length;
    }


    })
    console.warn('... NotificationData', notificationData)
    this.setState({all_notifications:notificationData})     
  }

  create_Notification(record) {     
    this.setState({
      all_notifications:[...this.state.all_notifications, 
        {conversation_id:record.conversation_id, 
         type:record.Message.Message_data.type,
         from:record.Message.from,
         fname: record.fname,
         lname:record.lname,
         name: record.fname,
         group_type: record.group_type,
         group_name: record.group_name      
        }]}, function(){this.generateNotificationData()}.bind(this)) 
    this.setState({fresh_notifications:[...this.state.fresh_notifications, {conversation_id:record.conversation_id}]}, function(){
      
      this.props.set_notification_length(this.state.fresh_notifications.length)
    }.bind(this))    
    // Notification creation start
    // If the Notifications API is supported by the browser
    // then show the notification
    if (this.n.supported()) {
      let image = get_Picture(record.Message.from);
      let notification_body =
        record.Message.Message_data.type == "string"
          ? record.Message.Message_data.text.substring(0, 30)
          : "You have a New Message";
      this.setState({
        bn: { title: record.fname, body: notification_body, image: image },
      });
    //  alert(`NEW MSSAGE!!`)
      this.n.show();
    }
  }

  createConversation(record, isNew) {
    return {
      id: record.group_id,
      name:
        record.group_type == "individual" || record.group_type == "BOT"
          ? record.fname + " " + record.lname
          : record.fname + " " + record.lname + " and others",
      fName:
        record.group_type == "individual" || record.group_type == "BOT"
          ? record.fname
          : record.group_name,
      lName: record.lname,
      group_type: record.group_type,
      username: record.username,
      isNew:
        record.Message.from == this.props.logInStatus.username ? false : true,
    };
  }

  set_user_profile_pic(username) {
    let userImage = get_Picture(username);
    this.setState({ user_profile_pic: userImage });
  }

  set_partner_details(name) {
    this.setState({ partner_name: name });
  }

  onVideoButtonClick() {
      //Hide Notification Tab First
      this.toggleShow_notification(false)
    this.setState({ isVideoButtonClicked: !this.state.isVideoButtonClicked });
    this.props.open_zoom_modal(
      this.state.isVideoButtonClicked,
      "https://" + zoom_app_host + ":" + zoom_app_port
    );
  }

  getGroupContext(value, currentContext) {
    if (value.startsWith("@H")) {
      this.setState({
        groupContext: "hermes",
      });

      return "hermes";
    } else if (value.startsWith("@") && !value.startsWith("@H")) {
      this.setState({
        groupContext: "group",
      });
      return "group";
    } else {
      this.setState({
        groupContext: "group",
      });

      return "group";
    }
  }

  setGroupContext(value) {
    this.setState({ groupContext: value }, () => this.state.groupContext);
  }

  /** This method create Message Object for text messages and calls for it's persistence */
  async df_text_query(text) {
    this.updateLastSeen();
    this.setState({
      latest_conversation: this.props.conversationData.conversation_id,
    });
    if (this.state.chat_with === "BOT" || this.state.chat_with === "BOT") {
      text = "@H " + text;
    }

    let group_context = this.getGroupContext(text, this.state.groupContext);

    if (group_context == "hermes") {
      let user_message = "";
      if (text.startsWith("@H ")) {
        user_message = text.replace("@H ", "");
      } else {
        user_message = text;
      }

      await this.sendMessageToDb(
        {
          from: this.props.logInStatus.username,
          user_type: "human",
          Message_data: {
            type: "string",
            text: user_message,
          },
        },
        ""
      ).then(async (response) => {
        await this.send_to_nlp(user_message).then((nlpResponse) => {
          this.sendMessageToDb(
            {
              from: "bot@hermes",
              reply_to: this.props.logInStatus.firstName,
              user_type: "bot",
              Message_data: nlpResponse.data,
            },
            "bot"
          );
        });
      });
    } 
    
    else if (group_context == "group") {
      let user_message = "";

      if (text.startsWith("@group ")) {
        user_message = text.replace("@group ", "");
      } else {
        user_message = text;
      }
      // this.sendMessageToDb({type:"string",text:user_message},"")
      this.sendMessageToDb(
        {
          from: this.props.logInStatus.username,
          user_type: "human",
          Message_data: {
            type: "string",
            text: user_message,
          },
        },
        ""
      );
    }

    else {
      const message_record = {
        from: this.props.logInStatus.username,
        user_type: "human",
        Message_data: {
          type: "string",
          text: text,
        },
      }
      this.sendMessageToDb(
        message_record,
        ""
      );
    }
  }

  onFeedbackSend(message, to){
    const message_record = {
      from: 'feedback@hermes.com',
      user_type: "human",
      Message_data: {
        type: "string",
        text: message,
      },
    }


    let chatMessage = JSON.stringify(message_record);
    var newData = new String();
    newData = chatMessage.toString().replace(/'/g, "").replace(/&/g, " and ");
     
   let chat_data =  {
      Message: JSON.parse(newData),
      message_id: uuid(),
      conversation_id: '9caeb1fc-693e-47eb-ac27-58aa4d299b29',
      group_id: '9caeb1fc-693e-47eb-ac27-58aa4d299b29',
      from: 'feedback@hermes.com',
      fname: 'Feedback',
      lname: '',
      group_type: 'individual',
      group_name: 'Feedback',
      partnerMail: to,
      username:'feedback@hermes.com', 
      to:to
    }
  sendPrivateMessage(chat_data)
     
  //this.setState({lazy_loading:{status:false, loading_message:""}})
  this.setState({ requestPending: false });  
  this.scrollToBottom();

  }

/** This methods take a Message object and modify it for persistence */
  getMessageBody(message){  
    let chatMessage = JSON.stringify(message);
    var newData = new String();
    newData = chatMessage.toString().replace(/'/g, "").replace(/&/g, " and ");
     
    return {
      Message: JSON.parse(newData),
      message_id: uuid(),
      conversation_id: this.props.conversationData.conversation_id,
      group_id: this.props.conversationData.conversation_id,
      from: this.props.logInStatus.username,
      fname: this.props.logInStatus.firstName,
      lname: this.props.logInStatus.lastName,
      group_type: this.props.conversationData.group_type,
      group_name: this.props.conversationData.group_name,
      partnerMail: this.state.partnerMail,
      username:this.props.logInStatus.username, 
      to:this.state.newChatInitiated.to
    };
  }

  /** This method takes Message object and adds some properties to it and sends the final object to Chat Server */
  async sendMessageToDb(message, from) {     
        //If newChatInitiated == true create new Group and save to server first
        if(this.state.newChatInitiated.status){          
          let requestUrl =
          chatbot_api_host +
          "/setConversationDetails?from=" + this.props.logInStatus.username + "&to=" + this.state.newChatInitiated.to + "&group_type=individual" 
           let response = await axios.get(requestUrl);           
           this.props.set_conversation_id(response.data);
           this.props.set_group_id(response.data);
           //Insert conversation to conversattions[] state and join Room
           joinRoom(response.data)
           let new_Conversation = {...this.state.newConversation, id: response.data}
           this.setState({conversations:[... this.state.conversations, new_Conversation]}, function(){
           console.warn('Callback of setState()')
           console.warn(this.state.conversations) 
          //  this.addConversationPosition(new_Conversation, true)     
         }.bind(this))  
        }
    if (
      message.Message_data.type == "file_attachement" ||
      message.Message_data.type == "image_attachement"
    ) {
      this.setState({
        lazy_loading: { status: true, loading_message: "Uploading file...." },
      });
    }
    this.setState({ requestPending: true }); 
    
   if(this.state.newChatInitiated.status){
    sendNewPrivateMessage(this.getMessageBody(message))
    this.setState({newConversation:{status:false, to: null}})
   }
   else{
    sendPrivateMessage(this.getMessageBody(message))
   } 

   
        //this.setState({lazy_loading:{status:false, loading_message:""}})
        this.setState({ requestPending: false });  
        this.scrollToBottom();
  }

  async get_nlp_response(reqBody) {
    let response = await axios.post(
      "https://" +
        nlp_gateway_host +
        ":" +
        nlp_gateway_port +
        "/conversion/response/v0",
      reqBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 5000,
      }
    );

    return response;
  }

  async send_to_nlp(text) {
    let message_uuid = uuid();
    this.props.update_botTyping_to_true();
    this.props.bot_message_added();
    this.props.update_botTyping_to_true();

    let request = {
      MESSAGE: {
        QUERY: text,
        QUERY_UUID: message_uuid,
        SESSION_ID: this.props.sesstionDetails.session_id,
        USER_NAME:
          this.props.logInStatus.firstName +
          " " +
          this.props.logInStatus.lastName,
      },
    };

    let nlpResquest = await axios.post(
      "https://" +
        nlp_gateway_host +
        ":" +
        nlp_gateway_port +
        "/conversion/request/v0",
      request,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 5000,
      }
    );

    //Checking for Response Code
    if (
      nlpResquest.data.MESSAGE.ERRORCODE &&
      nlpResquest.data.MESSAGE.ERRORCODE == "00"
    ) {
      let reqBody = JSON.stringify(request);
      let req_count = 0;
      let nlpFinalResult = "";
      do {
        this.sleep(2000);
        nlpFinalResult = await this.get_nlp_response(reqBody);
        req_count++;
      } while (nlpFinalResult.data.ERRORCODE && req_count < 4);

      this.props.update_botTyping_to_false();
      if (nlpFinalResult.data.ERRORCODE) {
        return {
          data: {
            ERRORCODE: 502,
            ERRORMSG: "Opps!! Response from NLP is Empty",
            UUID: "3a8cd690-3326-46a9-aadd-ad8377f0cb26",
          },
        };
      }
      return nlpFinalResult;
    } else {
      let nlpFinalResult = {
        data: {
          ERRORCODE: 502,
          ERRORMSG: "Opps!! NLP Request sent some error",
          UUID: "3a8cd690-3326-46a9-aadd-ad8377f0cb26",
        },
      };
      this.props.update_botTyping_to_false();
      return nlpFinalResult;
    }
  }

  sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {}
  }

  async fetchConversationList(agent_id) {
    await this.insertHermesConversation();
    return new Promise(
      function (resolve, reject) {
        axios
          .get(chatbot_api_host + "/getConversationsList/?agent_id=" + agent_id, {withCredentials: true})
          .then(
            function (response) {              
              let conversation_array = [];
              for (let i = 0; i < response.data.length; i++) {
                
                let conversations = {
                  id: response.data[i].group_id,
                  name:
                    response.data[i].group_type == "individual" ||
                    response.data[i].group_type == "BOT"
                      ? response.data[i].fname + " " + response.data[i].lname
                      : response.data[i].fname +
                        " " +
                        response.data[i].lname +
                        " and others",
                  fName:
                    response.data[i].group_type == "individual" ||
                    response.data[i].group_type == "BOT"
                      ? response.data[i].fname
                      : response.data[i].group_name,
                  lName: response.data[i].lname,
                  group_type: response.data[i].group_type,
                  username: response.data[i].username,
                  isNew: false,
                  from: response.data[i].group_type == 'individual' ? response.data[i].group_participants.filter(e=>e != this.props.logInStatus.username)[0]:'group_user'
                };

                conversation_array.push(conversations);
              }

              resolve(conversation_array);
            }.bind(this)
          )
          .catch((err) => {
            reject([]);
          });
      }.bind(this)
    );
  }

  /**
   * This method is responsible for handling the stuff once a new message event occure
   */
  async onMessageArrived(response={data:[]}) {  
    if (this.state.is_mounted) { 
      this.setState({ requestPending: true });    
      for (let i = 0; i < response.data.length; i++) {
        //Creating message object only if active in conversation 
        if(response.data[i].conversation_id == this.props.conversationData.conversation_id) 
        {
          if(this.state.newChatInitiated.status == true)this.setState({newChatInitiated:{status:false, to:null}})
          this.createMessage(response.data[i])     
        //Update Latest Conversation
        this.setConversationPosition(response.data[0]) 
        }
        else{ 
          //Handle if both users stsrts new chat with each other at same time [Satrts]
          if(this.state.newChatInitiated.status == true && this.state.newChatInitiated.to == response.data[0].from){ 
            this.props.set_conversation_id(response.data[0].conversation_id);
            this.props.set_group_id(response.data[0].conversation_id);
            // joinRoom(response.data[0].conversation_id)
            this.setState({newChatInitiated:{status:false, to:null}})
            this.createMessage(response.data[0])     
            //Update Latest Conversation
            this.setConversationPosition(response.data[0]) 

            //Insert conversation to conversattions[] state and join Room
            // joinRoom(response.data)
          }
          //Handle if both users stsrts new chat with each other at same time [Ends]
          else{
          // If Yes -> Update Conversations[]
          if(this.state.conversations.filter(c=>c.id == response.data[0].conversation_id).length < 0){
            joinRoom(response.data[0].conversation_id)
            let new_Conversation = {
              fName: response.data[0].fname,              
              from: response.data[0].group_type == 'individual' ? response.data[0].group_participants.filter(e=>e != this.props.logInStatus.username)[0]:'group_user',              
              group_type:  response.data[0].group_type,
              id:  response.data[0].conversation_id,
              isNew: true,
              lName:  response.data[0].lname,
              name:  response.data[0].fname + response.data[0].lname,
              username:  response.data[0].to_username
          }
          this.setState({conversations:[... this.state.conversations, new_Conversation]}, function(){
            console.warn('Callback of setState()')
            console.warn(this.state.conversations) 
            this.setConversationPosition(response.data[0], true)     
          }.bind(this))  
          }
          else{
            this.setConversationPosition(response.data[0], true) 
          }
          //Create Notification
          this.create_Notification(response.data[0]);  
          }
        } 
      }
    this.setState({ chat_length: response.data.length }); 
    this.setState({ lazy_loading: { status: false, loading_message: "" } });
    this.setState({ requestPending: false });
    }
  }

/**This methods generates message object for state messages from the message record in the database*/
  createMessage(data){ 
    if (
      data.Message.Message_data.MESSAGE &&
      data.Message.Message_data.MESSAGE["BODYTYPE"] ==
        "STRING"
    ) { 
      if (
        data.Message.Message_data.MESSAGE.BODY &&
        data.Message.Message_data.MESSAGE.BODY != ""
      ) {
        let ResponseText =
        data.Message.Message_data.MESSAGE.BODY;
        let sayss = {
          speaks:
          data.From_Participant_ID ==
            this.props.conversationData.from_participant_id
              ? "me"
              : "bot",
          msg: {
            text: {
              text: ResponseText,
            },
            url: "",
            tableItems: []
          },
          reply_to: data.Message.reply_to,
        };
        this.setState({
          messages: [...this.state.messages, sayss],
        });
      }

      //Adding an IFrame if exist
      if (
        data.Message.Message_data.MESSAGE.IFRAME &&
        data.Message.Message_data.MESSAGE.IFRAME != ""
      ) {
        let iframeSays = {
          speaks: "bot",
          url: data.Message.Message_data.MESSAGE.IFRAME,
          type: "iframe",
        };
        this.setState({
          messages: [...this.state.messages, iframeSays],
        });
      }

      this.scrollToBottom();
      // this.refreshConversations();
    } 
    else if (
      data.Message.Message_data.MESSAGE &&
      data.Message.Message_data.MESSAGE["BODYTYPE"] ==
        "LIST"
    ) {
      if ( data.MESSAGE.BODY.length == 0) {
        //if no record in tableData  let Defaultsayss = {
        const emplyTable = {
          speaks: "bot",
          msg: {
            text: {
              text: "No records abailable",
            },
          },
        };

        if (data.MESSAGE.IFRAME == "") {
          this.setState({
            messages: [...this.state.messages, emplyTable],
          });
        }
      } else {
        // this.renderListMessages(response);
      }

      if (
        data.MESSAGE.IFRAME &&
        data.MESSAGE.IFRAME != ""
      ) {
        let iframeSays = {
          speaks: "bot",
          url: data.MESSAGE.IFRAME,
          type: "iframe",
        };

        this.setState({
          messages: [...this.state.messages, iframeSays],
        });
      }
    } 
    else if (
      data.Message.Message_data.ERRORMSG &&
      data.Message.Message_data.ERRORCODE
    ) {
      let userQuery = {
        speaks: "bot",
        msg: {
          text: {
            text: data.Message.Message_data.ERRORMSG,
          },
          url: "",
          tableItems: [],
        },
        from: data.Message.from,
        reply_to: data.Message.reply_to,
      };

      this.setState({
        messages: [...this.state.messages, userQuery],
      });
    } 
    else if (
      data.Message.Message_data &&
      data.Message.Message_data.type ==
        "image_attachement"
    ) {
      let userQuery = {
        speaks:
        data.Message.from ==
          this.props.conversationData.from_participant_id
            ? "me"
            : "bot",
        msg: {
          images: data.Message.Message_data.data,
          file_path: data.Message.Message_data.file_path,
          tableItems: [],
        },
        is_notification: data.group_type == "Notifier",
        conversation_id: data.conversation_id,
        from:data.Message.from
      };

      this.setState({
        messages: [ ...this.state.messages, userQuery],
      });
      this.scrollToBottom();
      // this.refreshConversations();
    } 
    else if (
      data.Message.Message_data &&
      data.Message.Message_data.type == "file_attachement"
    ) {
      let userQuery = {
        speaks:
        data.Message.from ==
          this.props.conversationData.from_participant_id
            ? "me"
            : "bot",
        msg: {
          files: data.Message.Message_data.data,
          url: "",
          file_path: data.Message.Message_data.file_path,
          tableItems: [],
        },
        is_notification: data.group_type == "Notifier",
        conversation_id: data.conversation_id,
        from:data.Message.from
      }; 
      this.setState({
        messages: [...this.state.messages, userQuery],
      });
      this.scrollToBottom();

      // this.refreshConversations();
    }
    
    else {
      
      let userQuery = {
        speaks:
        data.Message.from ==
          this.props.conversationData.from_participant_id
            ? "me"
            : "bot",
        msg: {
          text: {
            text: data.Message.Message_data.text,
          },
          url: "",
          tableItems: [],
        },
        from: data.Message.from,
        is_notification:data.group_type == "Notifier",
        conversation_id: data.conversation_id,   
        origin: data.Message.origin
      };
      this.setState({
        messages: [...this.state.messages, userQuery],
      });
      this.scrollToBottom();
      // this.refreshConversations();
    }
  }

  /**
   * This methos is responsible for fetching all message record from server for an individual chat
   * This should be called after any chat list or user list get seleceted
   * This is also responsible for refreshing the messsages[] once a chat gets selected
   * @param {*} conversation_id
   *
   */
  async fetchChatHistory(conversation_id) {
    
      this.setState({isFeedback: conversation_id.toLowerCase().includes('-feedback')})
    

    if (this.state.is_mounted) {
      this.setState({
        lazy_loading: {
          status: true,
          loading_message: this.state.isNotifierGroup ? "Notifications loading..." :  "Loading Chats... Please wait",
        },
      });
      await axios
        .get(
          chatbot_api_host +
            "/fetchChatByCid?conversation_id=" +
            conversation_id +
            "&username=" +
            this.props.logInStatus.username +
            "&searchForDataFromDate=", {withCredentials: true}
        )
        .then(
          function (res){      
            this.setState({ messages: [] });
            let response = { data: [] };
            for (let i = 0; i < res.data.length; i++) {
              if (
                res.data[i].Message.conversation_id ==
                this.props.conversationData.conversation_id
              )
                response.data.push(res.data[i]);
                else{
                  response.data.push(res.data[i]);
                }
            }
         

            for (let i = 0; i < response.data.length; i++){
              
              this.createMessage(response.data[i].Message)
            }
            this.setState({ chat_length: response.data.length });

            //Make isNew = false for this conversation id  start
            let conversations = this.state.conversations; 
            conversations.map(conversation=>{
              if(conversation.id == conversation_id){
                conversation.isNew = false;
              }
              return conversation
            })  
            this.setState({conversations: conversations})
            //Make isNew = false for this conversation id  end

            //then clear/delete otification for this conversation as well
            this.deleteNotificationDataById(conversation_id) 
          }.bind(this)
        )
        .catch();

      this.setState({ lazy_loading: { status: false, loading_message: "" } });
    }

    // this.refreshConversations();
    this.scrollToBottom();
  }

  async insertHermesConversation() {
    await axios
      .get(
        chatbot_api_host +
          "/setConversationDetails?from=" +
          this.props.logInStatus.username +
          "&to=bot@hermes&group_type=BOT&username="+this.props.logInStatus.username
      )
      .then((res) => {})
      .catch((err) => {});
  }

  renderListMessages(MESSAGE, reply_to) {
    let message = MESSAGE;
    let tableItems = MESSAGE.BODY[0];
    let data = MESSAGE.BODY;
    let columns = [];
    let keys = Object.keys(tableItems);

    for (let i = 0; i < keys.length; i++) {
      columns.push({
        title: keys[i],
        field: keys[i],
      });
    }

    // for (let count = 0; count < response.data.MESSAGE.BODY.length; count++) {
    for (let i = 0; i < MESSAGE.BODY.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        let propName = columns[j].field;
        // data.push({
        //   propName : tableItems[i][columns[j].title]
        // })
        data[i][propName] = MESSAGE.BODY[i][columns[j].title];
      }
    }

    // }

    const tableData = {
      speak: "bot",
      type: "tableList",
      text: MESSAGE.HEADER,
      columns,
      data,
      reply_to: reply_to,
    };

    this.setState({
      messages: [...this.state.messages, tableData],
    });
    this.props.set_table_list_data({ columns, data });
    // this.props.open_modal()
  }

  setConversationPosition(conversation, isNew=false, position = 2){     
    let xx = [...this.state.conversations]; 
    let latest_conversation_index = xx.findIndex((p) => p.id == conversation.conversation_id);
    if(latest_conversation_index == -1){
      
      joinRoom(conversation.conversation_id)
      //Create conversation 
      let new_Conversation = {
        fName: conversation.fname,              
        from: conversation.username,
        group_type:  conversation.group_type,
        id:  conversation.conversation_id,
        isNew: true,
        lName:  conversation.lname,
        name: conversation.fname + conversation.lname,
        username:  conversation.username
    }

    xx.unshift(new_Conversation)
    let sorted_conversation = this.sortConversation(xx)
    this.setState({conversations: sorted_conversation}) 
    return;
    }

    let latest_conversation = xx[latest_conversation_index] 
    if(isNew){
      latest_conversation.isNew = true;
    }
    let conversation_minus_latest_conversation = xx.filter(function(p) {
      return p.id  !== conversation.conversation_id
    }) 
    conversation_minus_latest_conversation.unshift(latest_conversation)
    let sorted_conversation = this.sortConversation(conversation_minus_latest_conversation)
    this.setState({conversations: sorted_conversation})
  }
 

  sortConversation(conversations){     
    let xx = conversations 
    let bot_conversation = xx[xx.findIndex((p) => p.username == "bot@hermes")]
    // let noti_conversation = xx[xx.findIndex((p) => p.username == "notifier@hermes.com")]
    let sorted_conversation = xx.filter(function(p) {
      return p.username  !== "bot@hermes" && p.username  !== "notifier@hermes.com"
    })
    sorted_conversation.unshift(bot_conversation)
    return sorted_conversation; 
    } 

  scrollToBottom = () => {
    // this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
    // this.refs.chat_box_ref.scrollTo(0);

    if (this.refs.chat_box_ref) {
      var cc = this.refs.chat_box_ref;
      cc.scrollTop = cc.scrollHeight - cc.clientHeight;
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }
  
  renderOneMessage(message, i) {

    if(message.is_notification){
    return  <NotificationsTab
    message={message} 
    fetchChatHistory={this.fetchChatHistory} 
    conversation_id={message.conversation_id}
    toggleChatWindow={this.toggleChatWindow}
    set_partner_details={this.set_partner_details}
    set_user_profile_pic={this.set_user_profile_pic}
    set_chat_with={this.set_chat_with}  
    updateLastSeen={this.updateLastSeen}
    set_talk_to_what = {this.props.set_talk_to_what}
    setIsNotifierGroup = {this.setIsNotifierGroup}
    ></NotificationsTab>
    }

    else{
      
      if (message.msg && message.msg.text && message.msg.text) {
        return (
          <React.Fragment key={i}>
            {/* {this.props.isTyping == true && <div>  <img className="bot-typing" src="image/typing.gif"></img> </div>  }
             */}
            {message.is_notification ? (
              <NotificationsTab fetchChatHistory={this.fetchChatHistory} conversation_id={message.conversation_id}></NotificationsTab>
            ) : (
              <Message
                key={i}
                speaks={message.speaks}
                text={message.msg.text.text}
                isTyping={this.props.isTyping}
                url={message.msg.url ? message.msg.url : ""}
                from={message.from}
                reply_to={message.reply_to}
                is_notification={message.is_notification}
                isFeedback = {this.state.isFeedback} 
                origin = {message.origin}
              />
            )}
  
            {/* {
              message.speaks == 'bot' &&   < MinIframe></MinIframe>
            } */}
          </React.Fragment>
        );
      } 
      else if (message.msg && message.msg.images) {
        return (
          <React.Fragment key={i}>
            {/* {this.props.isTyping == true && <div>  <img className="bot-typing" src="image/typing.gif"></img> </div>  }
             */}
            <Message
              key={i}
              speaks={message.speaks}
              images={message.msg.images}
              isTyping={this.props.isTyping}
              file_path={message.msg.file_path}
              url={message.msg.url ? message.msg.url : ""}
              is_notification={message.is_notification}
            />
            {/* {
              message.speaks == 'bot' &&   < MinIframe></MinIframe>
            } */}
          </React.Fragment>
        );
      }
       else if (message.msg && message.msg.files) { 
        let messages = message.msg.files.map((file, i) => {
          return (
            <Message
              speaks={message.speaks}
              file={file ? file : "this is file"}
              file_path={message.msg.file_path[0]}
              key={i}
              isTyping={this.props.isTyping}
              url={message.msg.url ? message.msg.url : ""}
              is_notification={message.is_notification}
            />
          );
        });
        return (
          <React.Fragment key={i}>
            {/* {this.props.isTyping == true && <div>  <img className="bot-typing" src="image/typing.gif"></img> </div>  }
             */}
            {messages}
            {/* {
              message.speaks == 'bot' &&   < MinIframe></MinIframe>
            } */}
          </React.Fragment>
        );
      } else if (message.type == "tableList" && message.columns && message.data) {
        //  return (<ModalOne type="list" tableData={message.msg.tableItems} />)
        return (
          <Message
            speaks="bot"
            isTyping={this.props.isTyping}
            columns={message.columns}
            data={message.data}
            text={message.text}
            reply_to={message.reply_to}
            is_notification={message.is_notification}
          />
        );
      } else if (message.type == "iframe") {
        return (
          <MinIframe
            is_notification={message.is_notification}
            url={message.url}
          ></MinIframe>
        );
      }
    }
    


    //this.scrollToBottom();
  }

  renderMessage(stateMessage) { 
    if (stateMessage) { 
      return stateMessage.map((message, i) => {
        return this.renderOneMessage(message, i);
      }); 
    } else {
      return null;
    }
  }

  toggleShowChat(newState) {
    //Reset active conversation of switching from chat
    // if (this.state.showChat) {
    //   this.props.set_conversation_id();
    // }
    if(newState == false){
      this.props.set_conversation_id()
    }
    this.setState({ showChat: newState });
  }

  async toggleChatWindow(newState, conversationId) {
    //Hide Notification Tab First
    this.toggleShow_notification(false)
    //diaable new ChatInitiated OFF if true
    if(this.state.newChatInitiated.status == true){
      this.setState({newChatInitiated:{status:false, to:null}})
    }
    // this.setState({ isNotifierGroup: false });
    //Update last seen
   this.setIsAttachementMenuOpened(false) 
    this.updateLastSeen();
    this.setState({ messages: [] });
    this.toggleShowChat(newState);
    if (newState == true) {
      await this.fetchChatHistory(conversationId);
    }
    else{
      this.setIsNotifierGroup(false)
    }
  }

  _onClearDataButtomClick(){
    fetch(chatbot_api_host+"/clearcurrentchat?conversation_id="+this.props.logInStatus.username)
    .then(function(){
      this.toggleChatWindow(false)
    }.bind(this))
    .catch(err=>{})
  }

  _handleInputKeyPress(e) {

    if (e.key === "Enter" && e.target.value != "") {
      if (
        e.target.value == "disconnect me" ||
        e.target.value == "@disconnect"
      ) {
        this.props.set_talk_to_what("bot");
      } else {
        let final_string = e.target.value.replaceAll("'","").replaceAll("`", "")
        this.df_text_query(final_string);
      }

      e.target.value = "";
    }
  }

  _handleSendButton() { 
    let userMessage = this.refs.botInput.value;
    if (userMessage != "") {
      if (userMessage == "disconnect me" || userMessage == "@disconnect") {
        this.props.set_talk_to_what("bot");
        this.refs.botInput.value = "";
      } else {
         
        // sendPrivateMessage(this.getMessageBody({
        //   from: this.props.logInStatus.username,
        //   user_type: "human",
        //   Message_data: {
        //     type: "string",
        //     text: userMessage,
        //   },
        // }))
        this.df_text_query(userMessage);
        this.refs.botInput.value = "";
      }
    }
  }

  _onPlusButtonClick() {
      //Hide Notification Tab First
      this.toggleShow_notification(false)
    //getCurrentTime from server
    let date = new Date();
    this.setState({ lastSeen: date.toLocaleString() });

    if (this.state.isattachmentMenuOpen == true) {
      this.setState({ isattachmentMenuOpen: false });
    }

    if (this.state.openMenu == false) {
      this.setState({ openMenu: true });
    } else {
      this.setState({ openMenu: false });
      this.setState({ designationSelected: false });
    }
  }

  _onEmployeeListBackButton(status) {
    this.setState({ designationSelected: status });
  }

  toggleDesignation(status, employeeList) {
    this.setState({ employeeList: employeeList });
    this.setState({ designationSelected: status });
  }
  async talkToSomeOne(option) {
    
    //Becoz we have one BOT listed there
    this.set_chat_with(option.username);
    this.toggleShowChat(true);
    this.set_user_profile_pic(option.username);
    this.set_partner_details(option.name);
    //Becoz we have one BOT listed there
    let group_type = option.username == "bot@hermes" ? "BOT" : "individual";
    //this.props.set_talk_to_what(agent_name);
    //Check if conversation exist
    let c = this.state.conversations.filter(c=>c.from == option.username)
    
    if(c.length > 0){
          //Updating ConversationData in Redux Start
          // this.props.set_group_name()
          this.props.set_group_type(group_type)
          this.props.set_conversation_id(c[0].id);
          this.props.set_group_id(c[0].id);
          this.props.set_from_participantID(this.props.logInStatus.username);
          this.props.set_to_participantID(option.username);
          //Updating ConversationData in Redux ends          
          this.props.set_talk_to_what("agent");
          this.setState({ openMenu: false });
          this.setState({ showChat: true });
          this.fetchChatHistory(c[0].id); 
    }
    else{
      
       //Setting up flas for new conversation
       this.setState({newChatInitiated:{status:true, to:option.username}}); 
      //Preparing temporary newConversation state with id missing 
      this.setState({newConversation:{ 
          fName: option.username,              
          from: option.username,
          group_type: 'individual',
          id:  '',
          isNew: false,
          lName:  option.lname,
          name: `${option.name} ${option.lname}`,
          username:  option.username
      }})
      this.props.set_group_type(group_type)
      this.props.set_from_participantID(this.props.logInStatus.username);
      this.props.set_to_participantID(option.username);      
      //Updating ConversationData in Redux ends          
      this.props.set_talk_to_what("agent");
      this.setState({ openMenu: false });
      this.setState({ showChat: true });
     
    } 
  }

  async talkToSomeOne_working(agent_name) {
    //Becoz we have one BOT listed there
    this.set_chat_with(agent_name);
    this.toggleShowChat(true);
    this.set_user_profile_pic(agent_name);
    //Becoz we have one BOT listed there
    let group_type = agent_name == "bot@hermes" ? "BOT" : "individual";
    //this.props.set_talk_to_what(agent_name);
    //Create a new ConversationId for first time User - Agent chat
    let requestUrl =
      chatbot_api_host +
      "/setConversationDetails?from=" +
      this.props.logInStatus.username +
      "&to=" +
      agent_name +
      "&group_type=" +
      group_type;

    await axios
      .get(requestUrl)
      .then(
        function (response) {
                    
          //Updating ConversationData in Redux Start
          // this.props.set_group_name()
          this.props.set_group_type(group_type)
          this.props.set_conversation_id(response.data);
          this.props.set_group_id(response.data);
          this.props.set_from_participantID(this.props.logInStatus.username);
          this.props.set_to_participantID(agent_name);
          //Updating ConversationData in Redux ends          
          this.props.set_talk_to_what("agent");
          this.setState({ openMenu: false });
          this.setState({ showChat: true });
          // this.fetchChatHistory(this.props.conversationData.conversation_id);

          //After setting conversation details initiate a new chat 
          //TOTDO
          joinRoom(response.data)
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ messages: [] });
        }.bind(this)
      );
  }

  renderChatList(conversations, latest_conversation) {
    if (conversations.length == 0) {
      return (
        <ChatList
          listItem=""
          toggleChatWindow={this.toggleChatWindow}
          _onPlusButtonClick={this._onPlusButtonClick}
          set_user_profile_pic={this.set_user_profile_pic}
          set_chat_with={this.set_chat_with}
          conversations={[]}
          latest_conversation=""
          updateLastSeen={this.updateLastSeen}
        ></ChatList>
      );
    }

    return (
      <ChatList
        // listItem={listItem}
        toggleChatWindow={this.toggleChatWindow}
        set_partner_details={this.set_partner_details}
        set_user_profile_pic={this.set_user_profile_pic}
        set_chat_with={this.set_chat_with}
        conversations={conversations}
        latest_conversation={latest_conversation}
        updateLastSeen={this.updateLastSeen}
        set_talk_to_what = {this.props.set_talk_to_what}
        setIsNotifierGroup = {this.setIsNotifierGroup}
        fresh_notifications = {this.state.fresh_notifications}
      ></ChatList>
    );
  }

  set_chat_with(partnerType, partnerMail) {
    let chat_with =
      partnerType == "bot@hermes" || partnerType == "BOT" ? "BOT" : "Person";
    this.setState({ chat_with: chat_with, partnerMail: partnerMail });
  }

  _onSwitchWindowButtonClick() {
      //Hide Notification Tab First
      this.toggleShow_notification(false)
      //Deactivate live chat if active
      this.toggleChatWindow(false)
    // this.props.logout_user();
    this.props.set_talk_to_what("bot");
  }

  _onCancelButtonClick(){
    this.toggleChatWindow(false); 
    this.props.update_botStatus_inactive()
  }

  _toggleAttachButton() {

    if (this.state.openMenu == true) {
      this.setState({ openMenu: false });
    }
    this.setState({ isattachmentMenuOpen: !this.state.isattachmentMenuOpen });
  }

  _toggleUploaderMenu() {
    this.setState({ isUploaderMenuOpened: !this.state.isUploaderMenuOpened });
  }

  toggleShow_notification(value){
    this.setState({ show_notification: value == undefined? !this.state.show_notification:value });
  }

  _onShow_notificationClick(){
    this.toggleShow_notification()
  }

  setUploaderType(uploaderType) {
    this._toggleUploaderMenu();
    this.setState({ uploaderType: uploaderType });
  }

  async onShowAllEmployeesClick() {
    this.setState({ openMenu: true });
    await axios
      .get(
        chatbot_api_host + "/getEmployeesListByDesignation?designation=others&username="+this.props.logInStatus.username
      )
      .then((response) => {
        this.toggleDesignation(true, response.data);
      })
      .catch((err) => {});
  }

  handleClick(event) {
    // Do something here such as
    // console.log("Notification Clicked") OR
    // window.focus() OR
    // window.open("http://www.google.com")

    // Lastly, Close the notification
    this.n.close(event.target.tag);
  }

  componentWillMount() {
    //getCurrentTime from server
    let date = new Date();
    this.setState({ lastSeen: date.toLocaleString() });
    // this.fetchConversationList(this.props.logInStatus.username);
  }

  componentDidMount() {
    this.fetchConversationList(this.props.logInStatus.username).then(
      function (conversation_array) {
        //Sort conversation
        let sorted_conversation = this.sortConversation(conversation_array)
        this.setState({ conversations: sorted_conversation }); 
        this.setState({ is_mounted: true }); 
          socket1.on('privateMessage', function(data){ 
            console.warn(`New message arrived`, data)   
            // this.setState({newChatInitiated:{status:false, to:null}})   
            this.onMessageArrived( data)            
          }.bind(this))     
          socket1.on('feedback', function(data){ 
            
            console.log(`feedback Reecieved`, data)   
            // this.setState({newChatInitiated:{status:false, to:null}})   
            // this.onMessageArrived( data)            
          }.bind(this)) 
          socket1.on('patList', (data)=>{
            
            console.log('patList Recieved..!')
            console.log(data)
          })  
      }.bind(this)
    ); 
  }

  componentWillUnmount() {
    this.setState({ is_mounted: false });
  }

  componentDidUpdate(pp, ps) {
    // if (this.refs.botInput) {
    //   this.refs.botInput.focus();
    // }
    if (this.state != ps) {
      //   this.scrollToBottom();
      //  this.props.open_modal();
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* Browser notification  */}
        <ReactNotifications
          onRef={(ref) => (this.n = ref)} // Required
          title={this.state.bn.title} // Required
          body={this.state.bn.body}
          icon={this.state.bn.image}
          timeout="5000"
          // onClick={(event) => this.toggleChatWindow(false)}
        />

        <div className="chatbot-header z-depth-2">
          <div className="chatbot-logo-wrapper">
            {this.state.showChat && (
              <img
                src={this.state.user_profile_pic}
                class="ChatBotTopLogo"
              ></img>
            )}
            <h6 className="ChatBOTHeading">
              {/* {this.props.logInStatus.firstName} */}
              {this.state.showChat ? this.state.partner_name : ""}
            </h6>
          </div>
          <div className="chatbot-header-actions-wrapper">
            {/* NOTIFICATION ICONS START*/}
         {this.state.fresh_notifications.length > 0 &&   (<div
                className="TopCloseButton"
                onClick={()=>this._onShow_notificationClick()}
                tabIndex="0"
              > <i class="material-icons dp48">add_alert</i> <span>{this.state.fresh_notifications.length}</span>    
              </div>)}
            {/* NOTIFICATION ICONS ENDS*/}

            {this.props.logInStatus.isLogIn &&
              <div
               className=  "TopCloseButton"  
                onClick={function(){this.props.open_modal_for_feedback("feedback", "")}.bind(this)}
                tabIndex="0"
              >
                  <i class="material-icons dp48">rate_review</i>
              </div> }

            {this.state.showChat == true && this.state.openMenu == false && (
              <div
                className="TopCloseButton"
                onClick={() => this.toggleChatWindow(false)}
                tabIndex="0"
              >
               <i class="material-icons dp48">comment</i>     
              </div>
            )}

            {this.state.showChat == false && this.state.openMenu == true && (
              <div
                className="TopCloseButton"
                onClick={() => this._onPlusButtonClick()}
                tabIndex="0"
              >
                <i class="material-icons dp48">comment</i>
              </div>
            )}

            <div
              className="TopCloseButton"
              onClick={() => this.onVideoButtonClick()}
              tabIndex="0"
            >
              <i class="material-icons dp48">videocam</i>
            </div>

            <div
              className="TopRefreshButton"
              onClick={this.props.toggleChatWindowSize}
              tabIndex="0"
            >
              <i class="material-icons dp48">aspect_ratio</i>
            </div>

      

            <div
              className="TopCloseButton"
              onClick={this._onCancelButtonClick}
              tabIndex="0"
            >
              <i className="material-icons dp48">cancel</i>
            </div>
            <div
              className="TopCloseButton"
              onClick={() => this._onSwitchWindowButtonClick("bot")}
              tabIndex="0"
            >
              <i class="material-icons dp48">transfer_within_a_station</i>
            </div>
            <p>{this.props.isOpened}</p>
          </div>
        </div>

        <div
          id="chatbot"
          className={this.state.isNotifierGroup ? "agent full_height" : "agent"}
          ref="chat_box_ref"
        > 
          <div
            className={
              this.props.talk_to_what == "agent" && this.state.showChat
                ? "my-dummy-div active"
                : "my-dummy-div"
            }
          > 
            {this.state.isNotifierGroup ? (
              <>
              <div className={talk_to_human_styles.notifibox}>
                {this.renderMessage(this.state.messages)}
              </div>
           {  this.state.isNotifierGroup && <div>
             {this.state.messages.length > 0 ?<div
                className="TopCloseButton clear_notification_button"
                onClick={() => this._onClearDataButtomClick()}
                tabIndex="0"
              >
                <i class="material-icons dp48">delete_sweep</i>
              </div> :
              
              <div
                className="TopCloseButton clear_notification_button" 
                tabIndex="0"
              >
                 <span>You don't have any Notifications</span>
              </div>}
            
                </div>}
                </>
            ) : (
              this.renderMessage(this.state.messages)
            )}
          </div>

          <div
            className={
              this.props.talk_to_what == "agent" && this.state.showChat
                ? "my-dummy-div"
                : "my-dummy-div active"
            }
          >
            <ul className="collection no-border scrolling_on">
              {this.renderChatList(
                this.state.conversations,
                this.state.latest_conversation
              )}
            </ul>
          </div>

          {this.state.showChat == false && (
            <div
              class="TopCloseButton allChat"
              tabindex="0"
              onClick={this.onShowAllEmployeesClick}
            >
              <i class="material-icons dp48">comment</i>
            </div>
          )}

          {
            this.state.show_notification && (<div className={talk_to_human_styles.Notification_container}>
              <Notifications_Box onNotificationItemClicked={this.onNotificationItemClicked} all_notifications={this.state.all_notifications}></Notifications_Box>         
            </div>)
          }
          <div ref="last_chat_message" />
        </div>

        <div
          id="menuWindow"
          className={
            this.state.openMenu ? "Bottom-menu active" : " Bottom-menu"
          }
        >
          {this.state.designationSelected == false ? (
            <AgentList toggleDesignation={this.toggleDesignation} />
          ) : (
            <ListEmployees
              _onEmployeeListBackButton={this._onEmployeeListBackButton}
              talkToSomeOne={this.talkToSomeOne}
              toggleShowChat={this.toggleShowChat}
              listItems={this.state.employeeList}
              set_partner_details={this.set_partner_details}
              set_user_profile_pic={this.set_user_profile_pic}
              toggleDesignation={this.toggleDesignation}
              set_talk_to_what = {this.props.set_talk_to_what}
            ></ListEmployees>
          )}
 
        </div>
        <AttachementMenu
          classNames={
            this.state.isattachmentMenuOpen
              ? "Attachementmenu-wrapper active"
              : "Attachementmenu-wrapper"
          }
          sendMessageToDb={this.sendMessageToDb}
          _toggleAttachButton={this._toggleAttachButton}
          isattachmentMenuOpen={this.state.isattachmentMenuOpen}
          setUploaderType={this.setUploaderType}
        />

        {this.state.isUploaderMenuOpened == true && (
          <ImageAttachement
            classNames={
              this.state.isUploaderMenuOpened
                ? "image-attachement-wrapper active"
                : "image-attachement-wrapper "
            }
            sendMessageToDb={this.sendMessageToDb}
            _toggleAttachButton={this._toggleAttachButton}
            _toggleUploaderMenu={this._toggleUploaderMenu}
            isattachmentMenuOpen={this.state.isattachmentMenuOpen}
            isUploaderMenuOpened={this.state.isUploaderMenuOpened}
            uploaderType={this.state.uploaderType}
            logInStatus={this.props.logInStatus}
          ></ImageAttachement>
        )}

  {!this.state.isFeedback && (<div
          className={
            this.state.isNotifierGroup
              ? "input-wrapper top-only-shadow disabled"
              : "input-wrapper top-only-shadow"
          }
        >
          {/* <div
            className="add-button-wrapper blinkingX"
            onClick={this._onPlusButtonClick}
          >
            <span disabled={this.props.isTyping}>
              <i class="material-icons dp48 ">add_circle_outline</i>
            </span>
          </div> */}

          {this.props.isTyping ? (
            <p className="chatbotInputBox">Bot is Typing...</p>
          ) : (
            <div className="chatbotInputBox">
   <input
          className="input-box"
          pattern="^[a-zA-Z0-9]+$"
          type="text"
          onKeyPress={this._handleInputKeyPress}
          onKeyDown={this._handleKeyDown}
          onKeyUp={this._handleKeyUp}
          disabled={
            this.state.showChat == false ||
            this.props.isTyping ||
            this.state.openMenu ||
            this.state.lazy_loading.status ||
            this.state.isattachmentMenuOpen
          }
          // placeholder={this.state.requestPending ? 'Sending your message...' : "Type your message here"}
          placeholder={
            this.state.lazy_loading.status
              ? this.state.lazy_loading.loading_message
              : "Type your message here"
          }
          ref="botInput"
        ></input>)
     
            </div>
          )}

          <div
            className={
              this.state.showChat ? "attach-button" : "attach-button disabled"
            }
            onClick={this._toggleAttachButton}
            disabled={this.state.showChat == false}
          >
            <span disabled={this.state.showChat == false}>
              <i
                disabled={this.state.showChat == false}
                class="material-icons dp48"
              >
                attachment
              </i>
            </span>
          </div>

          {this.props.isTyping == false && (
            <div
              className={
                this.state.showChat
                  ? "send-button-wrapper"
                  : "send-button-wrapper disabled"
              }
              onClick={this._handleSendButton}
            >
              <span
                disabled={
                  this.state.showChat == false ||
                  this.props.isTyping ||
                  this.state.openMenu
                }
              >
                <i
                  disabled={this.state.showChat == false}
                  className="material-icons dp48"
                >
                  send
                </i>
              </span>
            </div>
          )}
        </div>)}
    
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    update_botStatus_inactive: () => {
      dispatch(update_botStatus_inactive);
    },
    update_botStatus_active: () => {
      dispatch(update_botStatus_active);
    },
    update_botTyping_to_true: () => {
      dispatch(update_botTyping_to_true);
      //    setTimeOut(() =>   dispatch(update_botTyping_to_true) , 3000)
    },
    update_botTyping_to_false: () => {
      dispatch(update_botTyping_to_false);
      // this.props.setTimeOut(() =>   dispatch(update_botTyping_to_false) , 3000)
    },
    bot_message_added: () => {
      dispatch(bot_message_added);
    },
    set_talk_to_what: (talk_to) => {
      dispatch({ type: "TALK_TO_WHAT_ACTION", payload: talk_to });
    },
    set_to_participant_id: (id) => {
      dispatch({ type: "TO_PARTICIPANT_ID_ACTION", payload: id });
    },

    set_table_list_data: (tableData) => {
      dispatch({ type: "TABLE_DATA_ACTION", payload: tableData });
    },
    open_modal_for_feedback: (type,url) => {
      dispatch({ type: "MODAL_TYPE_ACTION", payload: type });
      dispatch({ type: "MODAL_URL_ACTION", payload: url });
      dispatch(open_modal); 
    },
    open_modal: (url) => {
      dispatch({ type: "MODAL_TYPE_ACTION", payload: "dataList" });
      dispatch({ type: "MODAL_URL_ACTION", payload: url });
      dispatch({ type: "MODAL_STATUS_ACTION", payload: true });
    },
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
    logout_user: () => {
      dispatch({ type: "LOGOUT_ACTION" });
    },
    open_zoom_modal: (isOpened, zoom_url) => {
      dispatch({ type: "ZOOM_MODAL_URL_ACTION", payload: zoom_url });
      dispatch({ type: "ZOOM_MODAL_STATUS_ACTION", payload: isOpened });
    },
    set_group_name: (name)=>{
      dispatch({type:'GROUP_NAME_ACTION', payload:name})
    },
    set_group_type: (type)=>{
      dispatch({type:'GROUP_TYPE_ACTION', payload:type})
    },
    set_notification_length: (length)=>{ 
      dispatch({type:"NOTIFICATION_LENGTH_ACTION", payload:length})
    }
  };
};

const mapStateToProps = (state) => {
  return {
    isOpened: state.botStatus.isOpened,
    botMessagesLength: state.botMessagesLength.length,
    isTyping: state.isTyping.isTyping,
    talk_to_what: state.talk_to_what.name,
    tableData: state.tableListData,
    logInStatus: state.logInStatus,
    conversationData: state.conversationData,
    sesstionDetails: state.sessionDetails,
    notifications: state.notifications
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chatbot_Talk_To_Human);
