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
import { get_WorkflowResponse, get_doc, generateLeaveRequest } from "../../services/other_services";
import {generateDataCardMessageData, generateIframeMessageData, generateListMessagesData, generateTextMessageData, generatePdfMessage, generateFormMessage, generateStatusCardMessage, generateDocumentCardMessage} from '../../helpers/message_factory'
import {form_builder_url_user, form_builder_url_admin, excel_export_url} from '../../config' 
import LeaveRequestForm from "./forms/LeaveRequestForm";
import { get_initialization_leave_form_data } from "../../helpers/form_services";
import { socket1 } from "../../services/socketServices";
import LanguageSelection from "./LanguageSelection";
import { getTranslation } from "../../services/googleTanslate_services";

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
    this.get_ResponseFromFormBuilderApi = this.get_ResponseFromFormBuilderApi.bind(
      this
    );
    this.get_ResponseFromExcelExport = this.get_ResponseFromExcelExport.bind(
      this
    );
    this.setUserInput = this.setUserInput.bind(this);
    this.add_user_query_to_bot = this.add_user_query_to_bot.bind(this);
    this.process_workflow = this.process_workflow.bind(this);
    this.setWelcomeMenu = this.setWelcomeMenu.bind(this);
    this.setWelcomeMessage = this.setWelcomeMessage.bind(this);
    this.setWorkflow = this.setWorkflow.bind(this);
    this.createMessage = this.createMessage.bind(this);   
    this.setMessages = this.setMessages.bind(this);
    this.get_ResponseFromDocUpload = this.get_ResponseFromDocUpload.bind(this);
    // this.hide = this.hide.bind(this);
    // this.show = this.show.bind(this);

    this.state = {
      messages: [],
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
    };
  }

  setMessages(message){
    this.setState({
      messages: [...this.state.messages, message],
    });
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
    this.setState(
      { userInput: userInput },
      function () { 
      }.bind(this)
    );
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
    if (
      this.props.logInData.username ==
      "alvian@hermes.com"
    ) { 
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

  async get_ResponseFromDocUpload(text){
    // this.createMessage(text, "me");
    // this.props.bot_message_added();
    // this.setMessages(generateTextMessageData(text, "me"))
    // this.props.bot_message_added();
    this.props.update_botTyping_to_true(); 
    this.props.open_modal("iframe", "https://localhost:5017/pages/doc_search/upload_doc.html");
    // this.setMessages(generateTextMessageData("Please upload the document"))
    // this.props.bot_message_added();
    this.props.update_botTyping_to_false();
  }

  async get_ResponseFromExcelExport(text, requestData) {
    this.createMessage(text, "me");
    this.props.bot_message_added();
    this.props.update_botTyping_to_true(); 
    // this.createIframeMessage(video_url, "Click to open Excel upload");
    this.setMessages(generateIframeMessageData(excel_export_url, "Click to open Excel upload"))
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
        this.setMessages(generateTextMessageData("Can I help you with any other claims? Y/N"))
      }
    // }
    // catch(error){
      this.setMessages(generateTextMessageData("Something went wrong while processing the workflow!"))
    // }
    // finally{
      this.props.update_botTyping_to_false();
    // }

   
  }

  async df_text_query(text) {
     //Convert any otger language to english
     if(this.props.botType.language != 'en'){
      this.setMessages(generateTextMessageData(text, "me"), true);
      text = await getTranslation(text) 
    }
    else{
      this.setMessages(generateTextMessageData(text, "me"), true);
    }

    let text_lc = text.toLowerCase();
    if (text == "connect to agent" || text == "connect me" || text == "@connect" ) {
      this.props.set_talk_to_what("agent");
    } 
    else if (text.startsWith("form builder") || text.startsWith("open form builder")
    ) {
      let request_String = create_transcript_query(
        text
          .replace("Play the video where", "")
          .replace("were to be updated", ""),
        4
      );
      this.get_ResponseFromFormBuilderApi(text, request_String);
    } 
    else if (text.startsWith("file export") || text.startsWith("export file") || text.startsWith("excel upload") ||text.startsWith("upload excel")
    ) {
      let request_String = create_transcript_query(
        text
          .replace("Play the video where", "")
          .replace("were to be updated", ""),
        4
      );
      this.get_ResponseFromExcelExport(text, request_String);
    } 

    // else if (
    //   text_lc == "show me my leave history" ||
    //   text_lc == "i wish to raise a leave request for 4 days" ||
    //   text_lc == "medical claim" ||
    //   text_lc == "travel claim" ||
    //   text_lc == "leave history" ||
    //   text_lc == "leave request"
    // ) {
    //   let userInputToStoreProcedure;
    //   switch (text_lc) {
    //     case "medical claim": {
    //       userInputToStoreProcedure = "3";
    //       break;
    //     }

    //     case "travel claim": {
    //       userInputToStoreProcedure = "1";
    //       break;
    //     }

    //     case "i wish to raise a leave request for 4 days": {
    //       userInputToStoreProcedure = "4";
    //       break;
    //     }
    //     case "leave request": {
    //       userInputToStoreProcedure = "4";
    //       break;
    //     }

    //     case "show me my leave history": {
    //       userInputToStoreProcedure = "2";
    //       break;
    //     }

    //     case "leave history": {
    //       userInputToStoreProcedure = "2";
    //       break;
    //     }
    //   }
    //   this.add_user_query_to_bot(text);
    //   this.setWorkflow(true).then((res) => {
    //     this.process_workflow(
    //       userInputToStoreProcedure,
    //       this.props.logInData.username
    //     );
    //   });
    // } 

    // else if(text_lc.includes("i want leave")){
    //   this.setMessages(generateTextMessageData(text, "me"))
    //   const LRformData = await generateLeaveRequest(text) 
    //   this.createMessage({"BODYTYPE": "FORM", FORM_DATA: LRformData})
    // }
    // else if (text_lc == "show me the claims application menu") {
    //   this.add_user_query_to_bot(text);
    //   this.setWelcomeMenu();
    // } 
    // else if (this.state.workflow_status) { 
    //   if (text_lc == "y" || text_lc == "yes") {
    //     this.add_user_query_to_bot(text);
    //     this.props.update_botTyping_to_true();
    //     this.setWelcomeMenu();
    //     this.setWorkflow(true);
    //     this.props.bot_message_added();
    //     this.props.update_botTyping_to_false();
    //   } else if (text_lc == "n" || text_lc == "no") {
    //     this.add_user_query_to_bot(text);
    //     this.props.update_botTyping_to_true();
    //     this.setWorkflow(false);
    //     // this.createTextMessage("Thank you for using Hermes. Have a great day!");
    //     this.setMessages(generateTextMessageData("Thank you for using Hermes. Have a great day!"))
    //     this.props.bot_message_added();
    //     this.props.update_botTyping_to_false();
    //   } else {
    //     this.add_user_query_to_bot(text);
    //     this.process_workflow(text, this.props.logInData.username);
    //     this.props.bot_message_added();
    //   }

    //   // this.props.update_botTyping_to_false();
    // }

    else if(text_lc.includes('show pat')){
      this.setMessages(generateTextMessageData(text, "me")) 
      this.props.bot_message_added();
      alert("PAT LIST")
    }
     else {
      let message_uuid = uuid();
      this.props.update_botTyping_to_true();
      // if((text_lc.includes("document") || text_lc.includes("doc")) && (text_lc.includes("show") || text_lc.includes("open"))){
      //   this.setMessages(generateTextMessageData(text, "me"))
      //   this.props.bot_message_added();
      //   let  doc_data = await get_doc(text_lc)
      //   this.createMessage(doc_data.data)

      //   this.props.update_botTyping_to_false();
      //   return;
      // }

      // if((text_lc.includes("document") || text_lc.includes("doc")) && (text_lc.includes("add") || text_lc.includes("update"))){
      //     this.get_ResponseFromDocUpload(text);        
      //   return;
      // }
      if (text == "") {
        // this.createTextMessage("Ohoo!1 Plese type someting");
        this.setMessages(generateTextMessageData("Ohoo! Plese type someting"))
        this.props.update_botTyping_to_false();
      } else {
        // this.createTextMessage(text, "me");
        this.setMessages(generateTextMessageData(text, "me")) 
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
 
        //Sending User queery to gateway
        await get_nlp_response(reqBody)
          .then(
            function (response) { 
              if(response.status != 200){
                this.setMessages(generateTextMessageData(`Someting went wrong. Try again! 
                [${response.status} : ${response.statusText}]`))
                return;
              }
         try{     for (let i = 0; i < response.data.MESSAGE.RESULT.length; i++) {
                this.createMessage(response.data.MESSAGE.RESULT[i],  response.data.MESSAGE.INTENT_FLAG, response.data.MESSAGE.QUERY);
              }}
              catch(err){
                this.createMessage(response.data.MESSAGE.RESULT, response.data.MESSAGE.INTENT_FLAG);
              }
            }.bind(this)
          )
          .catch(
            function (err) {              
              // this.createTextMessage(
              //   "Something Wrong while sending/Mapping the data! Try Again"
              // );

              if(err && err.message){
                this.setMessages(generateTextMessageData(`OPPS! ${err.message}`))
              }
              else
              this.setMessages(generateTextMessageData("JSON format is Unknown!"))
            }.bind(this)
          );
        //Emable input bar
        this.props.update_botTyping_to_false();
      }
    }
  } 

  createMessage(messageData, INTENT_FLAG, QUERY) {
    try{
    if (messageData && messageData["BODYTYPE"] == "STRING" ) {
        //Adding a message if exist
        if (messageData.BODY && messageData.BODY != "") {
          // this.createTextMessage(messageData.BODY);
          this.setMessages(generateTextMessageData(messageData.BODY))
        }
  
        //Adding an IFrame if exist
        if (messageData.IFRAME && messageData.IFRAME != "") {
          // this.createIframeMessage(messageData.IFRAME);
          this.setMessages(generateIframeMessageData(messageData.IFRAME))
          this.props.open_modal("iframe", messageData.IFRAME);
        }
    } 
    else if (messageData && messageData["BODYTYPE"] == "LIST") {
      if (messageData.BODY.length == 0) {
        if (messageData.IFRAME && messageData.IFRAME == "") { 
          this.setMessages(generateTextMessageData("No Records available"))
        }
        else if(messageData.IFRAME && messageData.IFRAME != "") { 
          this.setMessages(generateIframeMessageData(messageData.IFRAME))
          this.props.open_modal("iframe", messageData.IFRAME);
        }
      } 
      else { 
        const listMessageData = generateListMessagesData(messageData.BODY, messageData.HEADER)
        this.setMessages(listMessageData)
        const {columns, data} = listMessageData
        //Auto opening Modal
        this.props.set_table_list_data({ columns, data });
        this.props.open_modal("dataList", "");

        if (messageData.IFRAME && messageData.IFRAME != "") { 
          this.setMessages(generateIframeMessageData(messageData.IFRAME))
          this.props.open_modal("iframe", messageData.IFRAME);
        }
      }

  
    } 
    else if (messageData["BODYTYPE"] == "REQUEST_STATUS") { 
      let says = {
        speaks: "bot",
        statuscard: messageData.BODY,
      };

      this.setState({ messages: [...this.state.messages, says] });
    } 
    else if (messageData && messageData["BODYTYPE"] == "STATUS_DATA") { 
      let says;

      if (messageData.BODY.Status.trim() == "Declined") {
        this.setMessages(generateTextMessageData(`Sorry ${this.props.logInData.firstName}, ${messageData.BODY.remarks}`))
      } else { 
        this.setMessages(generateDataCardMessageData(messageData.BODY))
      }
    } 
    else if(messageData && messageData["BODYTYPE"] == "FILE_ATTACHEMENT"){
      
      let pdf_message = ""; 
      if(INTENT_FLAG == "document_search"){ 
        let base64Array = messageData.data.map(str=>str.slice(2, str.length-1))
        pdf_message = generatePdfMessage(["Filename"], base64Array, 'data'); 
      }
 
      else{
        if(messageData["urls"] && messageData["urls"].length > 0) {
          pdf_message = generatePdfMessage(["Filename"], messageData.urls, 'url'); }
       else if(messageData["data"] && messageData["data"].length > 0) {
          pdf_message = generatePdfMessage(["Filename"], messageData.data, 'data'); }
      }
      this.setMessages(pdf_message)
      this.scrollToBottom();      
  


    }
    else if(INTENT_FLAG=="leave_request" || messageData && messageData["BODYTYPE"] == "FORMDATA"){
      
      let fd = messageData.BODY     
      if(fd['application date'] != "" && fd['empname'] != "" && fd['empno'] != "" && fd['fromdate'] != "" && fd['leavetype'] != "" && fd['noofdays'] != "" && fd['todate'] != ""){
        generateLeaveRequest({ fromDate:fd['fromdate'] , toDate:fd['todate'], noOfDays:fd['noofdays'], message:'', leaveType:fd['leavetype']  },  "bot@hermes")
        .then(function (res) {    
          setTimeout(function() {
            this.setMessages(generateTextMessageData(`Dear ${this.props.logInData.firstName}, We have recieved your leave request for ${ fd['noofdays'] } ${ fd['noofdays'] =='1' ? 'day': 'days' }` ))
           
          }.bind(this), 1000);
         
          setTimeout(function()  {
            this.createMessage(res.MESSAGE.RESULT[0], res.MESSAGE.INTENT_FLAG);
          }.bind(this), 2000);     
        }.bind(this))
        .catch((err) => console.log(err));
      }
      else{
        let form_message = generateFormMessage(messageData.BODY, QUERY)
        this.props.set_leaveFormData(get_initialization_leave_form_data(messageData.BODY, QUERY))
        this.setMessages(form_message)
      } 

      this.scrollToBottom();
    }
    else if(INTENT_FLAG=="powerbi_report" || messageData && messageData["BODYTYPE"] == "REPORT"){      
      let reports = messageData.BODY.reportData;
      // if(reports.length > 3){
      //   alert("List")
      // }
      // else{
        let reportListMessageData = ""
        for(let i=0; i<reports.length; i++){
          reportListMessageData += `<b>${reports[i].reportName}: </b> <a href='${reports[i].reportURL}' target='_blank'>click here</a><br>`
        } 
        this.setMessages(generateTextMessageData(reportListMessageData))
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
    }
    else if(messageData && messageData["BODYTYPE"] == "LEAVE_REQUEST_STATUS"){
      // this.setMessages(generateDataCardMessageData(messageData.BODY)) 
      this.setMessages(generateStatusCardMessage(messageData.BODY))
    }
    else if(messageData && (messageData["BODYTYPE"] == "DATA")){
      //INSIDE BODY WE WILL GWT A BASE62 DATA
      this.setMessages(generateTextMessageData(messageData.BODY))
    }
    else if(messageData["BODYTYPE"] == "DOC_SUGGESTIONS"){
      if(messageData.BODY.length == 1){
        this.setMessages(generateTextMessageData(messageData.BODY[0].headers))
        let base64String = messageData.BODY[0].data.slice(2,  messageData.BODY[0].data.length - 1) 
        this.setMessages(generatePdfMessage(["Filename"], [base64String], "data"))
      }
      else{ 
        this.setMessages(generateDocumentCardMessage(messageData))
      }        
    }
    else {
      this.setMessages(generateTextMessageData("Sorry! Response is Empty"))
    }}
    catch(e){
      throw new Error("Something went wrong while mapping the JSON")
    }
  }

  refeshChatbot() {
    let says = {
      speaks: "bot",
      msg: {
        text: {
          text: "hi! Welcome again!! How can I help you",
        },
      },
    };
    this.setState({ messages: [says] });
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
    const welcome_text = `Hello ${this.props.logInData.firstName}! This is Hermes,
          I have been trained to answer queries related to reports and leave request.
          I also come with a dynamic UI. You can drag and drop me at any corner of your screen.       
          You can also connect to your managers or team members by clicking the plus icon at the bottom.`;

    // const claim_text = `You can also apply and process any HR
    // claims through me using simple English language queries.`
    // this.createTextMessage(welcome_text);
    this.setMessages(generateTextMessageData(welcome_text))
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

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text) {
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
        />
      );
    } 
    else if (message.type == "iframe") {
      return (
        <MinIframe
          text={message.text}
          hideMinWindow={message.hideMinWindow ? true : false}
          url={message.url}
        ></MinIframe>
      );
    } 
    else if (message.menucard) {
      return (
        <Message
          speaks={message.speaks}
          menucard={message.menucard}
          from="bot@hermes"
        />
      );
    } 
    else if (message.datacard) {
      return (
        <Message
          speaks={message.speaks}
          datacard={message.datacard}
          from="bot@hermes"
        />
      );
    } 
    else if (message.statuscard) {
      return (
        <Message
          speaks={message.speaks}
          statuscard={message.statuscard}
          from="bot@hermes"
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
            filetype = {message.msg.filetype}
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
    else if(message.type == "form"){
      // return <LeaveRequestForm formData = {message.formData}></LeaveRequestForm>
      return (  <Message
      speaks={message.speaks}  
      form = {message.formData}
      userQuery = {message.userQuery}
      from = "bot@hermes"
      createMessage = {this.createMessage}
      createTextMessage = {(text)=>{this.setMessages(generateTextMessageData(text))}}
      
    />)
    }

    else if(message.type == "DOC_SUGGESTIONS"){
      return (  <Message
        speaks={message.speaks}  
        from="bot@hermes"
        createMessage={this.createMessage}
        createTextMessage={(text) => {
          this.setMessages(generateTextMessageData(text));
        }}
        type={message.type}
        suggestions = {message.suggestions}
      />)
      }
 
    this.scrollToBottom();
  } 

  onFormSubmit(messageData){
    this.setMessages(generateDataCardMessageData(messageData))
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
    //  reset user input after sending message
    this.setState({ userInput: "" });
  }

  _toggleAttachButton() {
    if (this.state.openMenu == true) {
      this.setState({ openMenu: false });
    }
    this.setState({ isattachmentMenuOpen: !this.state.isattachmentMenuOpen }); 
  }

  componentDidMount() { 
    this.setState({ is_mounted: true });
    // this.setWelcomeMenu()
    this.setWelcomeMessage(); 
  

  }

  shouldComponentUpdate(p, s) {
    return true;
  }

  componentDidUpdate(pp, ps) {
    if (this.refs.botInput) {
      // this.refs.botInput.focus();
    }

    this.scrollToBottom();
  }
  
  componentWillUnmount() {
    this.setState({ is_mounted: false });
  }

  render() {
    // if (this.state.showBot){
    return (
      <React.Fragment>
        {/* <div className="chatbot-Wrapper effect8 z-depth-5"> */}
        <ChatBotHeader
          update_botStatus_inactive={this.props.update_botStatus_inactive}
          toggleChatWindowSize={this.props.toggleChatWindowSize}
          refeshChatbot={this.refeshChatbot} 
        />

        <div
          id="chatbot"
          className={this.props.isLogIn ? "" : "logIn_form"}
          ref="chat_box_ref"
          disabled={this.state.openMenu}
        >
          {this.props.isLogIn ? (
            <React.Fragment>
              {this.renderMessage(this.state.messages)}
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

          {this.props.isTyping ? (
            <p className="chatbotInputBox">Bot is Typing...</p>
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

          {this.props.isTyping == false && (
            <div
              className="send-button-wrapper"
              onClick={this._handleSendButton}
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
    set_leaveFormData: (formData) =>{
      dispatch({type:"LEAVE_FORM_DATA_INITIALIZATION", payload:formData})
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chatbot_Talk_To_Bot);
