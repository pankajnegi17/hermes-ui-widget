import React, { Component } from "react";
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
import { open_modal } from "../../store/actions/modalStatusAction";
import ChatBotHeader from "./ChatBotHeader";
import LoginForm from "./LoginForm";
import create_transcript_query from "../../helpers/user_query_service";
import AutoSuggestedInput from "./AutoSuggestedInput";
import { generate_nlp_response_param } from "../../helpers/param_generator";
import { get_nlp_response } from "../../services/nlp_services";
import {
  get_WorkflowResponse,
  get_doc,
  generateLeaveRequest, 
  sendTranscript,
} from "../../services/other_services";
import {
  generateDataCardMessageData,
  generateIframeMessageData,
  generateListMessagesData,
  generateTextMessageData,
  generatePdfMessage,
  generateFormMessage,
  generateStatusCardMessage,
  generateDocumentCardMessage, 
  generateBotTypingData,
  generateDetailedCardMessage,
  generateActionMessageData,
} from "../../helpers/message_factory";
import {
  form_builder_url_user,
  form_builder_url_admin,
  excel_export_url,
} from "../../config";
import LeaveRequestForm from "./forms/LeaveRequestForm";
import { get_initialization_account_balance_form_data, get_initialization_leave_form_data } from "../../helpers/form_services";
import { askHumanHelp, sendQuery, socket1 } from "../../services/socketServices";
import LanguageSelection from "./LanguageSelection";
import { Button, Icon } from "@material-ui/core";
import SpeechToText from "../hermesvoice/SpeechToText";
import VoiceWaveOne from "../misc/VoiceWaveOne";
import JumpingDots from "../misc/JumpingDots";
import HermesLazyLoader from "../misc/HermesLazyLoader";
import { getHermesTranslation, getTranslation, getTranslitration } from "../../services/googleTanslate_services";
import { addTranscript, deleteTranscript } from "../../helpers/transcript_services";
import ConfirmModal from "../modals/ConfirmModal";
import { generateChatHistory } from "../../helpers/humanHandoff_helper";
import { TransferWithinAStationSharp, YoutubeSearchedFor } from "@material-ui/icons";

class Chatbot_Talk_To_Bot extends Component {
  messagesEnd = "";
  constructor(props) {
    super(props);
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this.refeshChatbot = this.refeshChatbot.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this._handleSendButton = this._handleSendButton.bind(this);
    this._onPlusButtonClick = this._onPlusButtonClick.bind(this);
    // this._handleKeyDown =this._handleKeyDown.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    this.toggleDesignation = this.toggleDesignation.bind(this);
    // this.talkToSomeOne = this.talkToSomeOne.bind(this);
    this._onEmployeeListBackButton = this._onEmployeeListBackButton.bind(this);
    this._toggleAttachButton = this._toggleAttachButton.bind(this);
    this.df_text_query = this.df_text_query.bind(this);
    this.get_ResponseFromFormBuilderApi =
      this.get_ResponseFromFormBuilderApi.bind(this);
    this.get_ResponseFromExcelExport =
      this.get_ResponseFromExcelExport.bind(this);
    this.setUserInput = this.setUserInput.bind(this);
    this.add_user_query_to_bot = this.add_user_query_to_bot.bind(this);
    this.process_workflow = this.process_workflow.bind(this);
    this.setWelcomeMenu = this.setWelcomeMenu.bind(this);
    this.setWelcomeMessage = this.setWelcomeMessage.bind(this);
    this.setWorkflow = this.setWorkflow.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.setMessages = this.setMessages.bind(this);
    this.get_ResponseFromDocUpload = this.get_ResponseFromDocUpload.bind(this);
    this.setmicBusy = this.setmicBusy.bind(this);
    this.onDocSuggestionSelect = this.onDocSuggestionSelect.bind(this);
    this.generateSpeech = this.generateSpeech.bind(this);
    this.addTypingBubble = this.addTypingBubble.bind(this);
    this.setTempMessages = this.setTempMessages.bind(this);
    this.removeTempMessages = this.removeTempMessages.bind(this);
    this.renderTempMessage  =this.renderTempMessage.bind(this);
    this.onConfirm  =this.onConfirm.bind(this)
    this.bot_event_handler = this.bot_event_handler.bind(this)
    this.initiateHandoff = this.initiateHandoff.bind(this)
    // this.hide = this.hide.bind(this);
    // this.show = this.show.bind(this);

    this.state = {
      messages: [],
      tempMessages:[],
      customMessages: [],
      showBot: true,
      openMenu: false,
      toggleMenuClass: "Hide-Bottom-Menu",
      is_mounted: false,
      inputHistory: [],
      inputPointer: 0,
      designationSelected: false,
      employeeList: [],
      isattachmentMenuOpen: false,
      lazyLoders: { login_process: false },
      userInput: "",
      workflow_status: false,
      workflow_id: null,
      micBusy:false,
      micText:"",
      previousQuery: "",
      Human_connected: false
    };
  }

  setMessages(message, typingBubble=false) {
   if(!typingBubble){ this.setState({
      messages: [...this.state.messages, message],
    });}

    else{
      this.setState((ps, p)=>{
        return {messages: [...ps.messages, message]}
      } )
    }
  }

  renderTempMessage(messages){  
    return (<Message
          typingBubble={true}
          // key={i}
          isTyping={this.props.isTyping}
          from="bot@hermes"
          speaks="bot"
          previousQuery={this.state.previousQuery}
          />)
  }


  setTempMessages(){
    let tempMessage = generateBotTypingData()
    this.setState({
      tempMessages: [...this.state.tempMessages, tempMessage],
    })
  }

  removeTempMessages(){
    this.setState({
      tempMessages: [],
    })
  }

  setWorkflow(value) {
    if (value) {
      return new Promise((resolve, reject) => {
        this.setState(
          { workflow_id: new Date().getMilliseconds() },
          function () {
            this.setState({ workflow_status: true }, () => {
              resolve();
            });
          }.bind(this)
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        this.setState({ workflow_id: null }, () => {
          this.setState(
            { workflow_status: false },
            function () {
              resolve();
            }.bind(this)
          );
        });
      });
    }
  }

  setUserInput(userInput) {
    this.setState({ userInput: userInput }, function () {}.bind(this));
  }

  toggleDesignation(status, employeeList) {
    this.setState({ employeeList: employeeList });
    this.setState({ designationSelected: status });
  }

  _onEmployeeListBackButton(status) {
    this.setState({ designationSelected: status });
  }

  async get_ResponseFromFormBuilderApi(text, requestData) {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text: text,
        },
      },
    };

    this.setState({ messages: [...this.state.messages, says] });

    this.props.bot_message_added();
    this.props.update_botTyping_to_true();

    let form_builder_url = form_builder_url_user;
    if (this.props.logInData.username == "alvian@hermes.com") {
      form_builder_url = form_builder_url_admin;
    }

    let iframeSays = {
      speaks: "bot",
      url: form_builder_url,
      type: "iframe",
      hideMinWindow: true,
      text: "Click to open form builder",
    };

    this.setState({
      messages: [...this.state.messages, iframeSays],
    });
    this.props.open_modal("iframe", form_builder_url);
    this.props.update_botTyping_to_false();
  }

  async add_user_query_to_bot(query) {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text: query,
        },
      },
    };

    this.setState({ messages: [...this.state.messages, says] });

    this.props.bot_message_added();
    this.props.update_botTyping_to_true();
  }

  async get_ResponseFromDocUpload(text) { 
    this.props.update_botTyping_to_true();
    this.props.open_modal(
      "iframe",
      "https://localhost:5017/pages/doc_search/upload_doc.html"
    ); 
    this.props.update_botTyping_to_false();
  }

  async get_ResponseFromExcelExport(text, requestData) {
    this.createMessage(text, "me");
    this.props.bot_message_added();
    this.props.update_botTyping_to_true();
    // this.createIframeMessage(video_url, "Click to open Excel upload");
    this.setMessages(
      generateIframeMessageData(excel_export_url, "Click to open Excel upload")
    );
    this.props.open_modal("iframe", excel_export_url);
    this.props.update_botTyping_to_false();
  }

  async process_workflow(query, username) {
    // try{

    this.props.update_botTyping_to_true();
    const response = await get_WorkflowResponse(
      query,
      username,
      this.state.workflow_id
    );
    this.createMessage(response);
    if (response.data.MESSAGE.BODY == "Thank you for using Hermes") {
      // this.createTextMessage("Can I help you with any other claims? Y/N");
      this.setMessages(
        generateTextMessageData("Can I help you with any other claims? Y/N")
      );
    }
    // }
    // catch(error){
    this.setMessages(
      generateTextMessageData(
        "Something went wrong while processing the workflow!"
      )
    );
    // }
    // finally{
    this.props.update_botTyping_to_false();
    // }
  }

  async onDocSuggestionSelect(suggestion){
        //Adding a Message from User's end
        this.setMessages( generateTextMessageData(suggestion.headers.substr(0,60), "me"));
        setTimeout(function() {
          this.setMessages( generateTextMessageData(suggestion.headers, "bot"))
        }.bind(this), 1000);
       setTimeout(function(){          
      // let base64String = suggestion.data.slice(2, suggestion.data.length - 1) 
      this.setMessages(generatePdfMessage(["Filename"], [suggestion.data], "data"))
       }.bind(this), 1500); 
        //Adding a message from Bot's End 
        //Adding a PdfCArd Afterword
        //TODO
  }

  initiateHandoff(){
    const chatHistory = generateChatHistory(this.state.messages)
    askHumanHelp({username: this.props.logInData.username, transcript: chatHistory, activeSocketId: sessionStorage.getItem('active_Socket_id')})
  }

  async df_text_query(text) {  
    //Delete any custom messages if any
    if(this.state.customMessages.length > 0 ){
      this.setState({customMessages:[]})
    }

    //Hardcoded string for human handOFF
    if(text == "cc" && !this.state.Human_connected){
      this.initiateHandoff()
      return;
    }

    if(this.state.Human_connected){
      console.log('Chat is being send to Human..') 
      this.setMessages(generateTextMessageData(text, 'me'))
      socket1.emit('human_talk', {messageData:generateTextMessageData(text, 'me'), room_id: socket1.id});    
      return;   
    }
    
    addTranscript(text)
    //Convert any otger language to english
    if(this.props.botType.language != 'en'){
      this.setMessages(generateTextMessageData(text, "me"), true);
       text = await getTranslation(text)
    }
    else{
      this.setMessages(generateTextMessageData(text, "me"), true);
    }   
    this.setTempMessages()     
    this.setState({previousQuery:text}) 
    let text_lc = text.toLowerCase();
    if (
      text == "connect to agent" ||
      text == "connect me" ||
      text == "@connect"
    ) {
      this.props.set_talk_to_what("agent");
    } else if (
      text.startsWith("form builder") ||
      text.startsWith("open form builder")
    ) {
      let request_String = create_transcript_query(
        text
          .replace("Play the video where", "")
          .replace("were to be updated", ""),
        4
      );
      this.get_ResponseFromFormBuilderApi(text, request_String);
    } else if (
      text.startsWith("file export") ||
      text.startsWith("export file") ||
      text.startsWith("excel upload") ||
      text.startsWith("upload excel")
    ) {
      let request_String = create_transcript_query(
        text
          .replace("Play the video where", "")
          .replace("were to be updated", ""),
        4
      );
      this.get_ResponseFromExcelExport(text, request_String);
    }
 
    else if (text_lc.includes("show pat")) { 
      this.props.bot_message_added();
      alert("PAT LIST");
    } 
    
    else {
      let message_uuid = uuid();
      this.props.update_botTyping_to_true(); 
      if (text == "") {
        // this.createTextMessage("Ohoo!1 Plese type someting");
        this.setMessages(generateTextMessageData("Ohoo! Plese type someting"));
        this.props.update_botTyping_to_false();
      } else {
        // this.createTextMessage(text, "me");
        this.props.bot_message_added();
        //Disable input box
        this.props.update_botTyping_to_true();
        //Preparing the parameters fr gateway
        let reqBody = generate_nlp_response_param(
          text,
          message_uuid,
          this.props.sesstionDetails.session_id,
          this.props.logInData.firstName,
          this.props.logInData.lastName,
          this.props.logInData.token,
          this.props.logInData.username
        );
        sendQuery({to:'nlp', payload: reqBody}) 
        this.props.update_botTyping_to_false();
      }
    }
    this.removeTempMessages()
  }

  addTypingBubble(data){
    this.setState({  messages: [...this.state.messages, data ] });
  
  }

  removeTypingBubble(){
    this.state.messages.pop()
  }

  generateSpeech(text, forceTalk = false){
    //configure ttsoption based on language selected in redux
    
    if(this.props.botType.format == 'voice' || forceTalk==true ){
      window.ttsEngine.getInstance().speak(   {
        "text": text,
        "audioUrl":"",
        "ttsOptions": this.props.botType.language == "en" ? {
            "language": "en-IN",
            "voice": "Google UK English Male",            
          } : {
            "language": "hi-IN",
            "voice": "Google हिन्दी",            
          } ,
        "onEnd":()=>{console.log("Completed TTS")}});
    }
  }

  async createMessage(messageData, INTENT_FLAG, QUERY) {
    //Adding a transcript record
    if(messageData["BODYTYPE"] == "STRING"){
      addTranscript(messageData['BODY'], "bot")
    } 
    else{
      addTranscript("", "bot", messageData.BODYTYPE)
    }
    try {
      if (messageData && messageData["BODYTYPE"] == "STRING") {
        //Adding a message if exist
        if (messageData.BODY && messageData.BODY != "") {
         if(this.props.botType.language == 'en') {this.generateSpeech(messageData.BODY)}
          // this.createTextMessage(messageData.BODY);
          if(this.props.botType.language != 'en'){ 
              messageData.BODY =  await getTranslation(messageData.BODY, this.props.botType.language)
              this.generateSpeech(  messageData.BODY )
              this.setMessages(generateTextMessageData(messageData.BODY));            
          }
          else this.setMessages(generateTextMessageData(messageData.BODY));
        }

        //Adding an IFrame if exist
        if (messageData.IFRAME && messageData.IFRAME != "") {
          // this.createIframeMessage(messageData.IFRAME);
          this.setMessages(generateIframeMessageData(messageData.IFRAME));
          this.props.open_modal("iframe", messageData.IFRAME);
        }
      } else if (messageData && messageData["BODYTYPE"] == "LIST") {
        if (messageData.BODY.length == 0) {
          if (messageData.IFRAME && messageData.IFRAME == "") {
            this.setMessages(generateTextMessageData("No Records available"));
          } else if (messageData.IFRAME && messageData.IFRAME != "") {
            this.setMessages(generateIframeMessageData(messageData.IFRAME));
            this.props.open_modal("iframe", messageData.IFRAME);
          }
        } else {
          const listMessageData = generateListMessagesData(
            messageData.BODY,
            messageData.HEADER
          );
          this.setMessages(listMessageData);
          const { columns, data } = listMessageData;
          //Auto opening Modal
          this.props.set_table_list_data({ columns, data });
          this.props.open_modal("dataList", "");

          if (messageData.IFRAME && messageData.IFRAME != "") {
            this.setMessages(generateIframeMessageData(messageData.IFRAME));
            this.props.open_modal("iframe", messageData.IFRAME);
          }
        }
      } else if (messageData["BODYTYPE"] == "REQUEST_STATUS") {
        let says = {
          speaks: "bot",
          statuscard: messageData.BODY,
        };

        this.setState({ messages: [...this.state.messages, says] });
      } else if (messageData && messageData["BODYTYPE"] == "STATUS_DATA") {
        let says;

        if (messageData.BODY.Status.trim() == "Declined") {
          this.setMessages(
            generateTextMessageData(
              `Sorry ${this.props.logInData.firstName}, ${messageData.BODY.remarks}`
            )
          );
        } else {
          this.setMessages(generateDataCardMessageData(messageData.BODY));
        }
      } else if (messageData && messageData["BODYTYPE"] == "FILE_ATTACHEMENT") {
        let pdf_message = "";
        if (INTENT_FLAG == "document_search") {
          let base64Array = messageData.data.map((str) =>
            str.slice(2, str.length - 1)
          );
          pdf_message = generatePdfMessage(["Filename"], base64Array, "data");
        } else {
          if (messageData["urls"] && messageData["urls"].length > 0) {
            pdf_message = generatePdfMessage(
              ["Filename"],
              messageData.urls,
              "url"
            );
          } else if (messageData["data"] && messageData["data"].length > 0) {
            pdf_message = generatePdfMessage(
              ["Filename"],
              messageData.data,
              "data"
            );
          }
        }
        this.setMessages(pdf_message);
        this.scrollToBottom();
      } else if (INTENT_FLAG == "leave_request" && (messageData && messageData["BODYTYPE"] == "FORMDATA") ) {
        if(this.props.botType.language != 'en') this.generateSpeech('कृपया इस फॉर्म को भरें')
        else this.generateSpeech('Please fill this form and submit it.')
        let form_message = generateFormMessage(messageData.BODY, QUERY);
        this.props.set_leaveFormData(
          get_initialization_leave_form_data(messageData.BODY, QUERY)
        );
        this.setMessages(form_message);
        this.scrollToBottom();
      } else if ( INTENT_FLAG == "powerbi_report" || (messageData && messageData["BODYTYPE"] == "REPORT") ) {
        let reports = messageData.BODY.reportData;
        // if(reports.length > 3){
        //   alert("List")
        // }
        // else{
        let reportListMessageData = "";
        for (let i = 0; i < reports.length; i++) {
          reportListMessageData += `<b>${reports[i].reportName}: </b> <a href='${reports[i].reportURL}' target='_blank'>click here</a><br>`;
        }
        this.setMessages(generateTextMessageData(reportListMessageData));
        // }

        // for(let i=0; i<messageData.BODY.reportData.length ; i++){
        // this.setMessages(generateTextMessageData("<b>Report name: </b> <a href='https://google.com'>click here</a>"))
        // this.setMessages(generateTextMessageData(`<b>${messageData.BODY.reportData[i].reportName}: </b> <a href='${messageData.BODY.reportData[i].reportURL}' target='_blank'>click here</a>`))

        //Adding an IFrame if exist
        //  if(i==0)this.setMessages(generateIframeMessageData(messageData.BODY.reportData[i].reportURL, messageData.BODY.reportData[i].reportName))
        //  else setTimeout(() => {
        //   this.setMessages(generateIframeMessageData(messageData.BODY.reportData[i].reportURL, messageData.BODY.reportData[i].reportName))
        //  }, i*500);
        // this.props.open_modal("iframe", messageData.IFRAME);

        // }
        this.scrollToBottom();
      } else if (  messageData && messageData["BODYTYPE"] == "LEAVE_REQUEST_STATUS" ) {
        // this.setMessages(generateDataCardMessageData(messageData.BODY))
        this.setMessages(generateStatusCardMessage(messageData.BODY));
      } else if ( messageData &&  (messageData["BODYTYPE"] == "DATA" && INTENT_FLAG == "document_search")   ) {
        //INSIDE BODY WE WILL GWT A BASE62 DATA
        this.setMessages(generateTextMessageData(messageData.BODY));
      } else if(messageData["BODYTYPE"] == "DOC_SUGGESTIONS"){
       if(messageData.BODY.length >0 ){ 
         if(messageData.HEADER && messageData.HEADER != ""){ this.setMessages(generateTextMessageData(messageData.HEADER))}
         if( messageData.BODY.length == 1){         
          this.setMessages(generateTextMessageData(messageData.BODY[0].headers))
          let base64String = messageData.BODY[0].data.slice(2,  messageData.BODY[0].data.length - 1) 
        this.setMessages(generatePdfMessage(["Filename"], [base64String], "data"))
        }
        else{ 
          this.setMessages(generateDocumentCardMessage(messageData))
        } }       
      } else if(messageData && messageData['BODYTYPE'] == "WEB_SUGGESTIONS"){ 
        if(messageData['BODY'].length > 0){
          this.setMessages(generateTextMessageData(messageData.HEADER))
          // let temp_messageData_array = messageData.BODY.map(data=>{
          //   return `<p><b>${data.main_title}</b></p>
          //   <p>${data.title}</p>
          //   <p>${data.value}</p>            
          //   <a href=${data.url} target="_blank">click here</a>
          //   <br>
          //   `
          // }) 
          // let temp_messageData_string = "";
          // for(let i=0;i<temp_messageData_array.length; i++){
          //   temp_messageData_string += temp_messageData_array[i]
          // }
        
          this.setMessages(generateDetailedCardMessage(messageData['BODY']))
        }
      }      
    } catch (e) {
      throw new Error("Something went wrong while mapping the JSON");
    }
  }

  refeshChatbot(message="hi! Welcome again!! How can I help you") {
    this.setState({ messages: [] });
    let says = {
      speaks: "bot",
      msg: {
        text: {
          text: message,
        },
      },
    };
    setTimeout(function()  {
      this.setState({ messages: [says] });
    }.bind(this), 500);
 
    this.props.update_botTyping_to_false();
    // window.location.reload(false);
  }

  setWelcomeMenu() {
    let says_xerox = {
      speaks: "bot",
      menucard: {
        cardHeader: "Check Status",
        menubuttons: [
          {
            text: "Medical Claim",
            callback: function (e) {
              this.df_text_query("medical claim");
            }.bind(this),
          },
          {
            text: "Travel Claim",
            callback: function (e) {
              this.df_text_query("travel claim");
            }.bind(this),
          },
          {
            text: "Leave Request",
            callback: function (e) {
              this.df_text_query("leave request");
            }.bind(this),
          },
        ],
      },
    };
    this.setState({ messages: [...this.state.messages, says_xerox] });
  }

  setWelcomeMessage() {
    const welcome_text = `Hello ${this.props.logInData.firstName}! This is <b>Hermes</b>,
          I have been trained to answer document search queries.
          I also come with a dynamic UI. You can drag and drop me at any corner of your screen.   &#x1f600`;

    // const claim_text = `You can also apply and process any HR
    // claims through me using simple English language queries.`
    // this.createTextMessage(welcome_text);
    this.setMessages(generateTextMessageData(welcome_text));
    // this.createTextMessage(claim_text)
  }

  scrollToBottom = () => {
    // this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
    // this.refs.chat_box_ref.scrollTo(0);

    if (this.refs.chat_box_ref) {
      var cc = this.refs.chat_box_ref;
      cc.scrollTop = cc.scrollHeight - cc.clientHeight;
    }
  };

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  onFormSubmit(messageData) {
    this.setMessages(generateDataCardMessageData(messageData));
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

  renderOneMessage(message, i) { 
    if(message.typingBubble && message.typingBubble == true){ 
     return ( <Message
       typingBubble={true}
       key={i}
       isTyping={this.props.isTyping}
       from="bot@hermes"
       speaks="bot"
       previousQuery={this.state.previousQuery}
       /> )
    }
    else if (message.msg && message.msg.text && message.msg.text) { 
      
      return (
        <React.Fragment key={i}>
          {/* {this.props.isTyping == true && <div>  <img className="bot-typing" src="image/typing.gif"></img> </div>  }
           */}
          <Message
            key={i}
            speaks={message.speaks}
            text={message.msg.text.text}
            isTyping={this.props.isTyping}
            url={message.msg.url ? message.msg.url : ""}
            listData={message.msg.listData}
            from="bot@hermes"
            previousQuery={this.state.previousQuery}
          />
          {/* {
            message.speaks == 'bot' &&   < MinIframe></MinIframe>
          } */}
        </React.Fragment>
      );
    } 
    else if (message.type == "tableList" && message.columns && message.data) {
      //  return (<ModalOne type="list" tableData={message.msg.tableItems} />)
      return (
        <Message
          speaks="bot"
          isTyping={this.props.isTyping}
          columns={message.columns}
          data={message.data}
          text={message.text}
          from="bot@hermes"
          previousQuery={this.state.previousQuery}
        />
      );
    } 
    else if (message.type == "iframe") {
      return (
        <MinIframe
          text={message.text}
          hideMinWindow={message.hideMinWindow ? true : false}
          url={message.url}
          previousQuery={this.state.previousQuery}
        ></MinIframe>
      );
    } 
    else if (message.menucard) {
      return (
        <Message
          speaks={message.speaks}
          menucard={message.menucard}
          from="bot@hermes"
          previousQuery={this.state.previousQuery}
        />
      );
    } 
    else if (message.datacard) {
      return (
        <Message
          speaks={message.speaks}
          datacard={message.datacard}
          from="bot@hermes"
          previousQuery={this.state.previousQuery}
        />
      );
    } 
    else if (message.statuscard) {
      return (
        <Message
          speaks={message.speaks}
          statuscard={message.statuscard}
          from="bot@hermes"
          previousQuery={this.state.previousQuery}
        />
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
            filetype={message.msg.filetype}
            from= 'bot@hermes'
            previousQuery={this.state.previousQuery}
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
    } 
    else if (message.type == "form") {
      // return <LeaveRequestForm formData = {message.formData}></LeaveRequestForm>
      return (
        <Message
          speaks={message.speaks}
          form={message.formData}
          formType = {message.formType}
          userQuery={message.userQuery}
          from="bot@hermes"
          createMessage={this.createMessage}
          createTextMessage={(text) => { 
            this.setMessages(generateTextMessageData(text));
          }}
          previousQuery={this.state.previousQuery}
          generateSpeech = {this.generateSpeech}
        />
      );
    }
    else if(message.type == "DOC_SUGGESTIONS"){
    return (  <Message
      onDocSuggestionSelect = {this.onDocSuggestionSelect}
      speaks={message.speaks}  
      from="bot@hermes"
      createMessage={this.createMessage}
      createTextMessage={(text) => {
        this.setMessages(generateTextMessageData(text));
      }}
      type={message.type}
      suggestions = {message.suggestions}
      previousQuery={this.state.previousQuery}
    />)
    }

    else if(message.type == "WEB_SUGGESTIONS"){  
      return (<Message
        onDocSuggestionSelect = {this.onDocSuggestionSelect}
        speaks={message.speaks}  
        from="bot@hermes"
        createMessage={this.createMessage}
        createTextMessage={(text) => {
          this.setMessages(generateTextMessageData(text));
        }}
        type={message.type}
        suggestions = {message.suggestions}
        previousQuery={this.state.previousQuery}>
 
      </Message>)
    }

    else if(message.type == "actions"){
      return (
        <Message
          speaks={message.speaks}
          actions={message.msg.actions}
          from="bot@hermes"
          previousQuery={this.state.previousQuery}
        />
      );
    }
    this.scrollToBottom();
  }

  setmicBusy(micStatus){
    this.setState({micBusy:micStatus})
  }

  _handleInputKeyPress(e) {
    if (e.key === "Enter" && e.target.value != "") {
      this.df_text_query(e.target.value);
      this.setState({
        inputHistory: [...this.state.inputHistory, e.target.value],
      });
      this.setState({ inputPointer: this.state.inputHistory.length });
      e.target.value = "";
      this.setState({ userInput: "" });
    }
  }

  _handleKeyUp(e) {
    if (e.key == "ArrowUp") {
      if (
        this.state.inputHistory.length > 0 &&
        this.state.inputPointer < this.state.inputHistory.length - 1
      ) {
        e.target.value = this.state.inputHistory[this.state.inputPointer + 1];
        this.setState({ inputPointer: this.state.inputPointer + 1 });
      }
    } else if (e.key == "ArrowDown") {
      if (this.state.inputHistory.length > 0 && this.state.inputPointer >= 0) {
        e.target.value = this.state.inputHistory[this.state.inputPointer];
        this.setState({ inputPointer: this.state.inputPointer - 1 });
      }
    }
  }

  _onPlusButtonClick() {
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

  _handleSendButton() {
    if (this.state.userInput != "") {          
      this.df_text_query(this.state.userInput);
    }
    //reset user input after sending message
    this.setState({ userInput: "" });
  }

  _toggleAttachButton() {
    if (this.state.openMenu == true) {
      this.setState({ openMenu: false });
    }
    this.setState({ isattachmentMenuOpen: !this.state.isattachmentMenuOpen });
  }

  bot_event_handler(socket){
    socket.on('bot_message', response=>{
      console.warn(`bot_message =>  [${response.status}]`)
      if (response.status != 200) {
        this.setMessages(
          generateTextMessageData(`Someting went wrong. Try again!  [${response.status} : ${response.statusText}]`)
        );
        return;
      }

      try {
        
        if(response.data.MESSAGE.RESULT.BODY != undefined){
          this.setMessages(generateTextMessageData(response.data.MESSAGE.RESULT.BODY))
        }
        for (let i = 0; i < response.data.MESSAGE.RESULT.length; i++) {
          if(response.data.MESSAGE.RESULT.length > 0){
            setTimeout(function(){
              this.createMessage(
                response.data.MESSAGE.RESULT[i],
                response.data.MESSAGE.INTENT_FLAG,
                response.data.MESSAGE.QUERY
              );
            }.bind(this), i*1000)
          } else{
            this.createMessage(
              response.data.MESSAGE.RESULT[i],
              response.data.MESSAGE.INTENT_FLAG,
              response.data.MESSAGE.QUERY
            );
          }
       
        }
      } catch (err) {
        this.createMessage(
          response.data.MESSAGE.RESULT,
          response.data.MESSAGE.INTENT_FLAG
        );
        console.log(err);
      }
       
    })

    socket.on('bot_text_message', data=>{
      console.warn(`bot_text_message => ${data.text}`)
      this.setMessages(generateTextMessageData(data.text))
    })

    socket.on('error_message', data=>{
      console.warn(`error message => ${data.response}`)
      // this.setMessages(generateTextMessageData(`OOPS! error occured`))
      //Show popup to connect with agent 
      this.setState({customMessages : [ generateActionMessageData([
        {value:"YES", onClick: ()=>{this.initiateHandoff();this.setState({customMessages:[]})}},
        {value:"NO", onClick: ()=>{this.setState({customMessages:[]})}}      
      ])]})
      
    })

    socket.on('Human_connected', data=>{       
      this.setMessages(generateTextMessageData(`You are connected!`))
      this.setState({Human_connected: true})
    })

    socket.on('human_reject', data=>{
      this.setMessages(generateTextMessageData(data.text))
      this.setState({Human_connected: false})
    })

    socket.on('human_talk', data=>{
      this.setMessages(data.messageData)
    })

    socket.on("issue_closed", data=>{
      this.setState({Human_connected: false});
      this.setMessages(generateTextMessageData(`Operator closed the current issue. Hope your isssue got resolved!`));
      //Ask for feedback 
      //TODO    
    })
    
    socket.on('Human_disconnected', data=>{      
      this.setMessages(generateTextMessageData(`You are Disconnected!`));
      this.setState({Human_connected: false})})

    console.log('Handlers registered..!!')
  }

  componentDidMount() { 
   setTimeout(function() {
    this.bot_event_handler(socket1)
   }.bind(this), 5000); 
    this.setState({ is_mounted: true });
    // this.setWelcomeMenu()
    this.setWelcomeMessage();
  }

  shouldComponentUpdate(p, s) {
    return true;
  }

  componentDidUpdate(pp, ps) {
    // if (this.refs.botInput) {
    //   this.refs.botInput.focus();
    // }

    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.setState({ is_mounted: false });
  }

    //this handler will be pass to ComfitmModal
    async onConfirm() {
      try {
        //Send Transcript
        await sendTranscript();
      } catch (err) {
      } finally {
        //clearTrancript
        deleteTranscript(); 
        //Finally close modal
        this.props.toggleConfirmModal(false);        
        //create new session (No need if login required)
        // this.props.createSession()
        //create welcome message
        this.refeshChatbot()
        //resetLoginStatus
        this.props.resetLoginStatus()
         //minimize chatbot
         this.props.update_botStatus_inactive()
      }
    }

  render() {
    // if (this.state.showBot){
    return (
      <React.Fragment>
              {this.props.confirmModal.isOpned && ( 
              <ConfirmModal
                onConfirm={this.onConfirm}
                onMinimize={function () {
                  this.props.update_botStatus_inactive()
                  this.props.toggleConfirmModal(false);
                }.bind(this)}
                onCancle={
                  function () { 
                    this.props.toggleConfirmModal(false);
                  }.bind(this)
                }
              ></ConfirmModal>
            )}

        {/* <div className="chatbot-Wrapper effect8 z-depth-5"> */}
        <ChatBotHeader
          update_botStatus_inactive={this.props.update_botStatus_inactive}
          toggleChatWindowSize={this.props.toggleChatWindowSize}
          refeshChatbot={this.refeshChatbot} 
          logInData = {this.props.logInData}
          generateSpeech = {this.generateSpeech}
        />

        <div
          id="chatbot"
          className={this.props.isLogIn ? "" : "logIn_form"}
          ref="chat_box_ref"
          disabled={this.state.openMenu}
        >
          {this.props.isLogIn ? (
            <React.Fragment>
              {/* {this.props.isTyping && <Message typingBubble={true} speaks="bot"></Message>} */}
              {this.renderMessage(this.state.messages)}
              {this.renderMessage(this.state.customMessages)}
              {this.props.isTyping && this.renderTempMessage()}
              <div ref="last_chat_message" />
            </React.Fragment>
          ) : (
            <LoginForm _onPlusButtonClick={this._onPlusButtonClick}></LoginForm>
          )}
        </div>

        <div
          className={
            this.props.logInData.isLogIn
              ? "input-wrapper top-only-shadow"
              : "input-wrapper top-only-shadow disabled"
          }
        >
           {this.props.isTyping == false &&<LanguageSelection setUserInput={this.setUserInput}></LanguageSelection> }
          {/* <div
            className="add-button-wrapper blinkingX"
            onClick={() => this.props.set_talk_to_what("agent")}
          >
            <span disabled={this.props.isTyping}>
              <i class="material-icons dp48 ">add_circle_outline</i>
            </span>
          </div> */}

    
     
          {/* {(this.state.micBusy) ? ( */}
            {(this.props.isTyping || this.state.micBusy) ? (
            // <p className="chatbotInputBox">{this.state.micBusy? <>Listning......</>: <JumpingDots noOfDots='3'></JumpingDots>}</p>
            <p className="chatbotInputBox">{this.state.micBusy && (<>{this.props.botType.language == 'en'? 'Listning...':'कृपया पूंछें......'}</>)}</p>
          ) : (
            <div className="chatbotInputBox">
              <AutoSuggestedInput
                df_text_query={this.df_text_query}
                setUserInput={this.setUserInput}
                _handleSendButton={this._handleSendButton}
                onKeyPress={this._handleInputKeyPress}
                className="input-box"
                onKeyUp={this._handleKeyUp}
                isDialog={this.state.workflow_status}
              />

        
              {/* <input
                className="input-box"
                type="text"
                onKeyPress={this._handleInputKeyPress}
                onKeyDown={this._handleKeyDown}
                onKeyUp={this._handleKeyUp}
                disabled={this.props.isTyping || this.state.openMenu }
                placeholder="Type your message here"
                ref="botInput"
              ></input> */}
            </div>
          )}

         
          {/* {true && (<button> &#127908;</Icon>)} */}
          <div class="mic-wrapper">
          {this.props.isTyping == false && (
          <SpeechToText setmicBusy={this.setmicBusy} send_text_to_bot={(text)=>this.df_text_query(text)}></SpeechToText>
       
          )}
          </div>

           
          {(this.props.isTyping == false) && (
            <div
              className="send-button-wrapper"
              onClick={this._handleSendButton}
              disabled = {this.state.micBusy}
            >
              <span disabled={this.props.isTyping || this.state.openMenu}>
                <i className="material-icons dp48">send</i>
              </span>
            </div>
          )}
        </div>
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
    set_table_list_data: (tableData) => {
      dispatch({ type: "TABLE_DATA_ACTION", payload: tableData });
    },

    open_modal: (type, url) => {
      dispatch({ type: "MODAL_TYPE_ACTION", payload: type });
      dispatch({ type: "MODAL_URL_ACTION", payload: url });
      dispatch(open_modal);
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
    set_leaveFormData: (formData) => {
      dispatch({ type: "LEAVE_FORM_DATA_INITIALIZATION", payload: formData });
    }, 
      toggleConfirmModal: (status) => {
      dispatch({ type: "UPDATE_COMFIRM_MODAL", payload: status });
    },
    resetLoginStatus: ()=>{
      dispatch({type:"LOGOUT_ACTION", payload:""})
    }
  };
};

const mapStateToProps = (state) => {
  return {
    isOpened: state.botStatus.isOpened,
    botMessagesLength: state.botMessagesLength.length,
    isTyping: state.isTyping.isTyping,
    talk_to_what: state.talk_to_what.name,
    isLogIn: state.logInStatus.isLogIn,
    userType: state.logInStatus.userType,
    logInData: state.logInStatus,
    sesstionDetails: state.sessionDetails,
    botType: state.botType,    
    confirmModal: state.confirmModal,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chatbot_Talk_To_Bot);
