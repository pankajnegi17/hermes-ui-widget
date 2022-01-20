import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import axios from "axios/index";
import "./login.css";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {
  vefification_api,
  domain,
  instance_type,
  chatbot_api_host,
} from "../../config";

import styles from "./LoginForm.module.css";

import hermesImage from "../../images/bot_avatar.jpg";

import swDev from "../../swDev";

import socketIOClient from "socket.io-client";

import { initializeHandlers } from "../../services/socketServices";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogIn: 0,
      credentials: {
        username: "",
        password: "",
      },
      logIn_request_pending: false,
      errorMessage: "",
    };

    

    this.setCredential = this.setCredential.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
  }

  setCredential(e, item) {
    let value = e.target.value;
    if (item == "username") {
      this.setState((prevState) => ({
        credentials: {
          // object that we want to update
          ...prevState.credentials, // keep all other key-value pairs
          username: value, // update the value of specific key
        },
      }));
    } else
      this.setState((prevState) => ({
        credentials: {
          // object that we want to update
          ...prevState.credentials, // keep all other key-value pairs
          password: value, // update the value of specific key
        },
      }));
  }

  onEnterPress(e) {
    if (
      e.key === "Enter" &&
      this.state.username != "" &&
      this.state.password != ""
    ) {
      this.onLoginClick();
    }
  }

  async onLoginClick() {
    
    let credentials = this.state.credentials;
    this.setState({ logIn_request_pending: true });
    await axios
      .post(vefification_api, {
        username: credentials.username,
        password: credentials.password,
        domain: domain,
        instance_type: instance_type,
      },
      {withCredentials: true})
      .then(
        function (res) {
          //Calling Service Worker
          swDev(res.data.userDetails.fname, res.data.userDetails.username);

          //Setting User Session Start
          sessionStorage.setItem("fname", res.data.userDetails.fname);
          sessionStorage.setItem("lname", res.data.userDetails.lname);
          sessionStorage.setItem("userType", res.data.userDetails.userType);
          sessionStorage.setItem("username", res.data.userDetails.username);
          sessionStorage.setItem(
            "nlp_gateway_url",
            res.data.userDetails.nlpUrl
          );
          sessionStorage.setItem("domain", domain);
          sessionStorage.setItem("instance_type", instance_type);
          //Setting User Session Ends

          //************** SET user data in store loginStatus=true **********//
          this.props.set_User_Data_After_Login({
            firstName: res.data.userDetails.fname,
            lastName: res.data.userDetails.lname,
            userType: res.data.userDetails.userType,
            username: res.data.userDetails.username,
            token: res.data.JSESSIONID,
          });
          

          //Establishing WebSocket
          const socket = socketIOClient.connect(chatbot_api_host, {
            secure: true,
          });

          socket.on("handshake", (data) => {
            console.warn(
              `SOCKET Established!!!!!!!!!!! with socketId: ${data.socketId}`
            );
            sessionStorage.setItem("active_Socket_id", data.socketId);
            socket.emit("createSelfRoom", {
              socketId: data.socketId,
              username: res.data.userDetails.username,
            });
          });

          socket.on("selfRoomCreated", (data) => {
            //Join all rooms NOTE: here socket i reffer to actual socket id
            socket.emit("joinRooms", {
              username: res.data.userDetails.username,
              socketId: data.socketId,
            });
          });

          socket.on("joinRooms_ok", (data) => {
            console.warn("USER HAS JOINED ALL ROOMS...!!");
          });

          socket.on("joinRoom_ok", (data) => {
            console.warn("User has joined a new Room");
          });

          initializeHandlers(socket, res.data.userDetails.username);

          this.setState({ isLogIn: 1 });
          this.setState({ errorMessage: "" });
        }.bind(this)
      )
      .catch(
        function (error) {
          this.refs.password_input_box.value = "";
          if (error.response && error.response.status == 403) {
            this.setState({ isLogIn: 3 });
          } else {
            this.setState({ isLogIn: 2 });
          }
          this.setState({
            errorMessage: error.response
              ? error.response.data
              : "Someting Went wrong",
          });
        }.bind(this)
      )
      .finally(
        function () {
          this.setState({ logIn_request_pending: false });
        }.bind(this)
      );
  }

  render() {
    return (
      <React.Fragment>
        <Container maxWidth="sm">
          <FormControl>
            <InputLabel htmlFor="username">Email address</InputLabel>
            <Input
              value={this.state.credentials.username}
              id="username"
              aria-describedby="my-helper-text"
              onChange={(e) => this.setCredential(e, "username")}
              onKeyPress={(e) => this.onEnterPress(e)}
              type="email"
            />
            <FormHelperText id="username-helper-text">
              Enter Your username
            </FormHelperText>
          </FormControl>
          <br></br>
          <FormControl>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              type="password"
              id="password"
              aria-describedby="my-helper-text"
              value={this.state.credentials.password}
              ref="password_input_box"
              onChange={(e) => this.setCredential(e, "password")}
              onKeyPress={(e) => this.onEnterPress(e)}
            />
            <FormHelperText id="password-helper-text">
              enter your password
            </FormHelperText>
          </FormControl>
          <br />
          <FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={this.onLoginClick}
            >
              Log In
            </Button>
          </FormControl>

          <FormControl>
            <br />
            <br />
            {this.state.isLogIn == 1 && (
              <Alert severity="success">
                <AlertTitle>Login Success</AlertTitle>
                Welcome to HERMES <strong>More than a BOT</strong>
              </Alert>
            )}
            {this.state.isLogIn == 2 && (
              <Alert variant="outlined" severity="error">
                {this.state.errorMessage}
              </Alert>
            )}

            {this.state.isLogIn == 3 && (
              <Alert variant="outlined" severity="error">
                {this.state.errorMessage}
              </Alert>
            )}
          </FormControl>
          {this.state.logIn_request_pending && (
            <FormControl>
              <br />
              <br />
              <Alert variant="outlined" severity="warning">
                Please wait..
              </Alert>
            </FormControl>
          )}

          <div className={styles.bottom_image_container}>
            <img
              src={hermesImage}
              className={`${styles.rotate} ${styles.linear} ${styles.infinite}`}
              width="150"
              height="150"
            />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logInData: state.logInStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set_User_Data_After_Login: (logInData) => {
      dispatch({ type: "LOGIN_SUCCESS_ACTION", payload: logInData });
    },
    set_talk_to_what: (talk_to) => {
      dispatch({ type: "TALK_TO_WHAT_ACTION", payload: talk_to });
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
