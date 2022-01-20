import React from "react";
import {
  update_botTyping_to_true,
  update_botTyping_to_false,
} from "../../store/actions/botTypingAction";
import { connect } from "react-redux";
import { close_modal, open_modal } from "../../store/actions/modalStatusAction";
import "./Message.css";
import bot_avatar from "../../images/bot_avatar.jpg";
import user_avatar from "../../images/user_image.jpg";
import PdfViewer from "./PdfViewer";
import ImageGallery from "./ImageGallery";
import Carousel from "react-images";
import MyCarousel from "./Carousal";
import PdfCard from "./cards/PdfCard";
import get_Picture from "../../helpers/user_profile_servies";
import MenuCard from "./cards/MenuCard";
import DataCard from "./cards/DataCard";
import StatusCard from "./cards/Status_Card";
import axios from "axios/index";
import { chatbot_api_host } from "../../config";
import Parser from "html-react-parser";
import LeaveRequestForm from "./forms/LeaveRequestForm";
import { sendPrivateMessage } from "../../services/socketServices";
import uuid from "react-uuid";
import DocumentCard from "./cards/DocumentCard";
import PdfSeggestionsCard from "./cards/PdfSeggestionsCard";
import AccountBalanceForm from "./forms/AccountBalanceForm";
import HermesRating from "./HermesRating";
import JumpingDots from "../misc/JumpingDots";
import DetailedCard from "./cards/DetailedCard";
import AccountBalanceForm_Hi from "./forms/AccountBalanceForm_Hi";
import LeaveRequestForm_Hi from "./forms/LeaveRequestForm_Hi";
import MessageActions from "./messages/MessageActions";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.feedbabkInputRef = React.createRef();
    this.state = {
      readMoreClicked: false,
      isShowMoreClicked: false,
    };
    this.setModalData = this.setModalData.bind(this);
    this.sendFeedback = this.sendFeedback.bind(this);
    this.openImageOnModal = this.openImageOnModal.bind(this);
    this.openPdfModalInModal = this.openPdfModalInModal.bind(this);
    this.onFeedbackReply = this.onFeedbackReply.bind(this);
    this.toggleisShowMoreClicked = this.toggleisShowMoreClicked.bind(this);
    this.onCustomFeedbackSend = this.onCustomFeedbackSend.bind(this);
  }

  sendFeedback(props, feedback) {
    //console.log("Question: "+this.props.text+" =>"+feedback);
  }

  async openImageOnModal(file_path) {
    let image_data = await axios.post(chatbot_api_host + "/getImage/", {
      file_path: file_path,
    });

    this.props.open_modal_for_images(image_data.data);
  }

  async openPdfModalInNewWindow(pdfData_path) {
    let response = await axios.post(chatbot_api_host + "/getFile", {
      file_path: pdfData_path,
    });
    let pdfWindow = window.open(
      "about:blank",
      "newwindow",
      "width=700,height=450"
    );
    pdfWindow.document.write(
      `<embed src="` +
        "data:application/pdf;base64," +
        response.data +
        `" width="100%" height="100%" 
type="application/pdf">`
    );
  }

  async openPdfModalInModal(pdfData_path, filetype) {
    //Get pdf data
    if (filetype == "url") {
      let response = await axios.post(chatbot_api_host + "/getFile", {
        file_path: pdfData_path,
      });
      this.props.open_modal_for_pdf(
        "data:application/pdf;base64," + response.data
      );
    } else {
      this.props.open_modal_for_pdf(
        "data:application/pdf;base64," + pdfData_path
      );
    }
  }

  toggleisShowMoreClicked(value) {
    this.setState({ isShowMoreClicked: value });
  }

  onFeedbackSend(message, to, origin) {
    const message_record = {
      from: "feedback@hermes.com",
      user_type: "human",
      Message_data: {
        type: "string",
        text: message,
      },
      origin: origin,
      isFeedback: true,
    };

    let chatMessage = JSON.stringify(message_record);
    var newData = new String();
    newData = chatMessage.toString().replace(/'/g, "").replace(/&/g, " and ");

    let chat_data = {
      Message: JSON.parse(newData),
      message_id: uuid(),
      conversation_id: to.split("@")[0] + "-feedback",
      group_id: to.split("@")[0] + "-feedback",
      from: "feedback@hermes.com",
      fname: "Feedback",
      lname: "",
      group_type: "individual",
      group_name: "Feedback",
      partnerMail: to,
      username: "feedback@hermes.com",
      to: to,
    };

    console.log(chat_data);
    sendPrivateMessage(chat_data);

    this.feedbabkInputRef.current.value = "";
    this.feedbabkInputRef.current.placeholder = "You sent a reply.";
    //this.setState({lazy_loading:{status:false, loading_message:""}})
    // this.setState({ requestPending: false });
    // this.scrollToBottom();
  }

  onCustomFeedbackSend(to, origin) {
    this.onFeedbackSend(
      `[${this.props.logInData.username}]: ${this.feedbabkInputRef.current.value}`,
      to,
      origin
    );
  }

  onFeedbackReply(text) {}

  setModalData(props) {
    if (this.props.isOpened) {
      this.props.close_modal();
    }
    //Disabling the toggle behaviour of click here
    // this.setState({ readMoreClicked: !this.state.readMoreClicked });
    this.setState({ readMoreClicked: true });
    this.props.set_table_list_data({
      columns: props.columns,
      data: props.data,
    });
    //Disabling the toggle behaviour of click here
    // this.props.open_modal(this.state.readMoreClicked);
    this.props.open_modal_for_data(true);
  }

  openUrlToNewWindow = (url) => {
    window.open(url, "_blank", "newwindow", "width=300,height=250");
  };

  openUrlToNewTab = (url) => {
    window.open(url, "_blank");
  };

  componentDidMount() {
    console.log(
      "Message Component Mounted..!",
      this.props.speaks,
      this.props.typingBubble
    );
  }

  render() { 
    console.log("this.props.actions: ",this.props.actions)
    if (this.props.file) {
    }
    //Preparing photos structure for gallery
    let photos = [];
    let files = [];
    if (this.props.images) {
      let images = this.props.images;
      let file_path = this.props.file_path;
      if (images.length == 1) {
        photos.push({
          file_path: file_path[0],
          img: images[0],
          title: "Image",
          auther: "Pankaj",
          cols: 1,
        });
      } else {
        for (let i = 0; i < images.length; i++) {
          photos.push({
            file_path: file_path[i],
            img: images[i],
            title: "Image",
            auther: "Pankaj",
            cols: i,
          });
        }
      }
    }

    if (this.props.files) {
      let allFiles = this.props.files;
      if (allFiles.length == 1) {
        files.push({
          file: allFiles[0],
          title: "PDF",
          auther: "Pankaj",
          cols: 1,
        });
      } else {
        for (let i = 0; i < allFiles.length; i++) {
          files.push({
            file: allFiles[i],
            title: "PDF",
            auther: "Pankaj",
            cols: i,
          });
        }
      }
    }

    return (
      <React.Fragment>
        {this.props.speaks == "bot" && (
          <div className="col s12 m8 offset-m2 offset-13 msg-outer">
            <div className="card-panel  z-depth-1 custom-card-panel ">
              <div className="row valign-wrapper margin-b-zero  ">
                <div
                  className="col s2 padding-zero avatar-style"
                  // onClick={() => props.open_modal("https://www.sms-group.com/")}
                >
                  {/* <a className="btn-floating btn-large waves-effect waves-light red">
                       {props.speaks}</a> */}

                  <img
                    className="bot-avatar-image"
                    src={get_Picture(this.props.from)}
                  />
                </div>

                {this.props.images && (
                  <div className="col s10  msg-content-wrapper message-content-wrapper-bot border-b-l-one border-zero">
                    {this.props.reply_to != undefined &&
                      this.props.reply_to != "" && (
                        <p className="pointToSomeone">@{this.props.reply_to}</p>
                      )}
                    <ImageGallery
                      galleryType="image"
                      photos={photos}
                      openImageOnModal={this.openImageOnModal}
                    ></ImageGallery>
                  </div>
                )}

                {this.props.file && (
                  <div className="col s10  msg-content-wrapper message-content-wrapper-bot border-b-l-one border-zero">
                    {this.props.reply_to != undefined &&
                      this.props.reply_to != "" && (
                        <p className="pointToSomeone">@{this.props.reply_to}</p>
                      )}
                    {/* <ImageGallery galleryType="file" file={this.props.file} openImageOnModal={this.openImageOnModal} ></ImageGallery> */}
                    <PdfCard
                      openPdfModal={this.openPdfModalInModal}
                      pdfData={this.props.file}
                      file_path={this.props.file_path}
                      filetype={this.props.filetype}
                    ></PdfCard>
                  </div>
                )}

                {this.props.text && !this.props.data && (
                  <div
                    className={
                      this.props.is_notification
                        ? "col s10  msg-content-wrapper   border-b-l-one  notification_item"
                        : "col s10  msg-content-wrapper message-content-wrapper-bot border-b-l-one  "
                    }
                  >
                    {this.props.reply_to != undefined &&
                      this.props.reply_to != "" && (
                        <p className="pointToSomeone">@{this.props.reply_to}</p>
                      )}
                    {/* <span className="black-text"> {Parser(this.props.text) }</span>  */}
                    <span className="black-text">
                      {" "}
                      {this.props.text.length > 250 &&
                      !this.state.isShowMoreClicked
                        ? Parser(this.props.text.slice(0, 250))
                        : Parser(this.props.text)}
                    </span>
                    {!this.state.isShowMoreClicked &&
                      this.props.text.length > 250 && (
                        <span
                          className="black-text cursor_pointer"
                          style={{ textDecoration: "underline" }}
                          onClick={() => this.toggleisShowMoreClicked(true)}
                        >
                          {" "}
                          more
                        </span>
                      )}
                    {this.state.isShowMoreClicked && (
                      <span className="black-text">
                        {" "}
                        {Parser(this.props.text)}
                      </span>
                    )}
                    {this.state.isShowMoreClicked && (
                      <span
                        className="black-text cursor_pointer"
                        style={{ textDecoration: "underline" }}
                        onClick={() => this.toggleisShowMoreClicked(false)}
                      >
                        {" "}
                        less
                      </span>
                    )}

                    {/* {this.props.isFeedback==true && (
                         <p className="pointToSomeone"
                          onClick={()=>{this.onFeedbackSend(`[${this.props.logInData.username}]: Thanks`, this.props.origin, this.props.logInData.username)}}
                          >reply</p>)} */}

                    {this.props.isFeedback == true && (
                      <>
                        <div className="reply-container">
                          <input
                            placeholder="Reply here"
                            ref={this.feedbabkInputRef}
                          ></input>
                          <i
                            className="material-icons dp48"
                            onClick={() =>
                              this.onCustomFeedbackSend(
                                this.props.origin,
                                this.props.logInData.username
                              )
                            }
                          >
                            send
                          </i>
                        </div>
                        {/* <p className="pointToSomeone" 
                     onClick={()=>{this.onFeedbackSend(`[${this.props.logInData.username}]: Thanks`, this.props.origin, this.props.logInData.username)}}
                     >
                       reply
                       </p> */}
                      </>
                    )}
                  </div>
                )}

                {this.props.text && this.props.data && (
                  <div className="col s10  msg-content-wrapper message-content-wrapper-bot border-b-l-one ">
                    {this.props.reply_to != undefined &&
                      this.props.reply_to != "" && (
                        <p className="pointToSomeone">@{this.props.reply_to}</p>
                      )}
                    <span className="black-text">{this.props.text}</span>
                    <p>
                      {"  "}
                      <a
                        // onClick={() =>this.openUrlToNewTab(this.props.url)}
                        //  onClick={()=>openUrlToNewWindow(props.url)}
                        onClick={() => this.setModalData(this.props)}
                      >
                        Click here
                      </a>
                    </p>
                  </div>
                )}

                {this.props.menucard && (
                  <div
                    className="col s10  msg-content-wrapper message-content-wrapper-bot width-70 "
                    style={{ width: "70% !important" }}
                  >
                    <MenuCard
                      cardHeader={this.props.menucard.cardHeader}
                      buttons={this.props.menucard.menubuttons}
                    ></MenuCard>
                  </div>
                )}

                {this.props.datacard && (
                  <div
                    className="col s10  msg-content-wrapper message-content-wrapper-bot  width-70 "
                    style={
                      ({ width: "70% !important" },
                      { borderRadius: "5px !important" },
                      { borderBottomLeftRadius: "0px !important" })
                    }
                  >
                    <DataCard datacard={this.props.datacard}></DataCard>
                  </div>
                )}

                {this.props.statuscard && (
                  <div
                    className="col s10  msg-content-wrapper message-content-wrapper-bot  width-70 "
                    style={
                      ({ width: "70% !important" },
                      { borderRadius: "5px !important" },
                      { borderBottomLeftRadius: "0px !important" })
                    }
                  >
                    <StatusCard statuscard={this.props.statuscard}></StatusCard>
                  </div>
                )}

                {this.props.type == "DOC_SUGGESTIONS" && (
                  <div className="col s10  msg-content-wrapper message-content-wrapper-bot ">
                    <PdfSeggestionsCard
                      suggestions={this.props.suggestions}
                      openPdfModal={this.openPdfModalInModal}
                      onDocSuggestionSelect={this.props.onDocSuggestionSelect}
                    ></PdfSeggestionsCard>
                  </div>
                )}

                {this.props.type == "WEB_SUGGESTIONS" && (
                  <div className="col s10  msg-content-wrapper message-content-wrapper-bot ">
                    <DetailedCard
                      suggestions={this.props.suggestions}
                    ></DetailedCard>
                  </div>
                )}

                {this.props.form && (
                  <div className="col s10  msg-content-wrapper message-content-wrapper-bot border-b-l-one">
                    {this.props.reply_to != undefined &&
                      this.props.reply_to != "" && (
                        <p className="pointToSomeone">@{this.props.reply_to}</p>
                      )}
                    <span className="black-text">
                      {this.props.botType.language == "en"
                        ? Parser("Please fill the form.")
                        : Parser("कृपया इस फॉर्म को भरें")}
                    </span>
                  </div>
                )}

                {this.props.typingBubble && (
                  <div className="col s10  msg-content-wrapper message-content-wrapper-bot border-b-l-one">
                    <span className="black-text">
                      <JumpingDots noOfDots="3"></JumpingDots>
                    </span>
                  </div>
                )}

                {this.props.actions && (
                  <div
                  className={
                    this.props.is_notification
                      ? "col s10  msg-content-wrapper   border-b-l-one  notification_item"
                      : "col s10  msg-content-wrapper message-content-wrapper-bot border-b-l-one  "
                  }
                > 
                  <span className="black-text">
                  Need a live support?
                  </span> 
                  <MessageActions actions={this.props.actions}></MessageActions>
                </div>
                )}
              </div>

              {/* below form is dysplayed in another row */}
              {this.props.form && this.props.formType == "leave_request" && (
                <div className="row valign-wrapper margin-b-zero  ">
                  {this.props.botType.language != "en" ? (
                    <LeaveRequestForm_Hi
                      createMessage={this.props.createMessage}
                      createTextMessage={this.props.createTextMessage}
                      userData={this.props.logInData}
                      formData={this.props.form}
                      userQuery={this.props.userQuery}
                      open_modal={this.props.open_modal}
                      generateSpeech={this.props.generateSpeech}
                    ></LeaveRequestForm_Hi>
                  ) : (
                    <LeaveRequestForm
                      createMessage={this.props.createMessage}
                      createTextMessage={this.props.createTextMessage}
                      userData={this.props.logInData}
                      formData={this.props.form}
                      userQuery={this.props.userQuery}
                      open_modal={this.props.open_modal}
                      generateSpeech={this.props.generateSpeech}
                    ></LeaveRequestForm>
                  )}
                </div>
              )}

              {/* below form is dysplayed in another row */}
              {this.props.form && this.props.formType == "account_balance" && (
                <div className="row valign-wrapper margin-b-zero  ">
                  {this.props.botType.language != "en" ? (
                    <AccountBalanceForm_Hi
                      createMessage={this.props.createMessage}
                      createTextMessage={this.props.createTextMessage}
                      userData={this.props.logInData}
                      formData={this.props.form}
                      userQuery={this.props.userQuery}
                      open_modal={this.props.open_modal}
                      generateSpeech={this.props.generateSpeech}
                    ></AccountBalanceForm_Hi>
                  ) : (
                    <AccountBalanceForm
                      createMessage={this.props.createMessage}
                      createTextMessage={this.props.createTextMessage}
                      userData={this.props.logInData}
                      formData={this.props.form}
                      userQuery={this.props.userQuery}
                      open_modal={this.props.open_modal}
                      generateSpeech={this.props.generateSpeech}
                    ></AccountBalanceForm>
                  )}
                </div>
              )}

              {/* This is another row for rating */}
              {!this.props.is_notification == true &&
                this.props.talk_to_what == "bot" && (
                  <div className="row margin-b-zero  reaction-button-wrapper ">
                    <div className="col s10 padding-zero ">
                      <HermesRating
                        query={this.props.previousQuery}
                        message={this.props}
                      ></HermesRating>
                      {/* <div
                      class="icon-preview col s2 m3"
                      onClick={() => this.sendFeedback(this.props, "like")}
                    >
                      <i class="material-icons dp48 thumbs-up">thumb_up</i>{" "}
                    </div>
                    <div
                      class="icon-preview col s2 m3"
                      onClick={() => this.sendFeedback(this.props, "dislike")}
                    >
                      <i class="material-icons dp48 thumbs-down">thumb_down</i>{" "}
                    </div> */}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {this.props.speaks == "me" && (
          <div className="col s12 m8 offset-m2 offset-13 msg-outer">
            <div className="card-panel   z-depth-1 custom-card-panel ">
              <div className="row valign-wrapper margin-b-zero ">
                {this.props.images && (
                  <div className="col s10 right-align   msg-content-wrapper message-content-wrapper-user border-zero ">
                    <ImageGallery
                      galleryType="image"
                      photos={photos}
                      openImageOnModal={this.openImageOnModal}
                    ></ImageGallery>
                  </div>
                )}

                {this.props.file && (
                  <div className="col s10 right-align    msg-content-wrapper message-content-wrapper-user border-zero">
                    {/* <ImageGallery galleryType="file" file={this.props.file} openImageOnModal={this.openImageOnModal} ></ImageGallery> */}
                    <PdfCard
                      openPdfModal={this.openPdfModalInNewWindow}
                      pdfData={this.props.file}
                      file_path={this.props.file_path}
                    ></PdfCard>
                  </div>
                )}

                {/* {      
                  this.props.files &&
                  <div className="col s10 right-align indigo lighten-5  msg-content-wrapper message-content-wrapper-user border-zero">
                 { this.props.files.map(file=>{ 
                    let pdfData = file.replace("data:application/pdf;base64,","")
  
                   return <PdfViewer base64data={pdfData}></PdfViewer>
                  })}
                  </div>
                } */}

                {this.props.text && (
                  <div className="col s10 right-align    msg-content-wrapper message-content-wrapper-user border-b-r-one ">
                    <span className="black-text">{this.props.text}</span>
                  </div>
                )}

                {this.props.data && (
                  <div className="col s10 right-align   msg-content-wrapper message-content-wrapper-user border-b-r-one ">
                    <p>
                      {" "}
                      <a
                        // onClick={() =>// openUrlToNewTab(props.url)}
                        //  onClick={()=>openUrlToNewWindow(props.url)}
                        onClick={() => this.setModalData(this.props)}
                      >
                        Click here
                      </a>
                    </p>
                  </div>
                )}

                <div className="col s2 padding-zero avatar-style">
                  {/* <a className="btn-floating btn-large waves-effect waves-light deep-purple accent-4">
                      {props.speaks}</a> */}
                  <img
                    className="bot-avatar-image"
                    src={get_Picture(this.props.logInData.username)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isTyping: state.isTyping.isTyping,
    isOpened: state.modalStatus.isOpened,
    modalUrl: state.modalStatus.modal_url,
    logInData: state.logInStatus,
    talk_to_what: state.talk_to_what.name,
    botType: state.botType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close_modal: () => {
      dispatch(close_modal);
    },
    open_modal: (payload) => {
      dispatch({ type: "MODAL_TYPE_ACTION", payload: payload });
      dispatch(open_modal);
    },
    open_modal_for_data: (readMoreClicked, url) => {
      dispatch({ type: "MODAL_TYPE_ACTION", payload: "dataList" });
      dispatch({ type: "MODAL_URL_ACTION", payload: url });
      dispatch({ type: "MODAL_STATUS_ACTION", payload: readMoreClicked });
    },
    open_modal_for_images: (images) => {
      dispatch({ type: "MODAL_IMAGE_DATA_ACTION", payload: images });
      dispatch({ type: "MODAL_TYPE_ACTION", payload: "image" });
      dispatch({ type: "MODAL_STATUS_ACTION", payload: true });
    },
    open_modal_for_pdf: (pdf) => {
      dispatch({ type: "MODAL_IMAGE_DATA_ACTION", payload: pdf });
      dispatch({ type: "MODAL_TYPE_ACTION", payload: "pdf" });
      dispatch({ type: "MODAL_STATUS_ACTION", payload: true });
    },
    update_botTyping_to_true: () => {
      dispatch(update_botTyping_to_true);
    },
    update_botTyping_to_false: () => {
      dispatch(update_botTyping_to_false);
    },
    set_table_list_data: (tableData) => {
      dispatch({ type: "TABLE_DATA_ACTION", payload: tableData });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
