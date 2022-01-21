import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";
import style from "./chatPreview.module.css";
import Box from "@mui/material/Box";
import { LOAD_LIVE_CHAT } from "../../redux/actions/liveChatActions";
import ImageIcon from "@mui/icons-material/Image";
import { Grid, IconButton } from "@mui/material";
import { ADD_ACTIVE_CHAT } from "../../redux/actions/activeChatsActions";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { INCOMING_REQUEST_DELETE } from "../../redux/actions/incomingRequestActions";
import { DISABLE_CHAT_PREVIEW } from "../../redux/actions/chatPreviewActions";
import CloseIcon from "@mui/icons-material/Close";

import Parser from "html-react-parser";
function createMessage(messageData) {
  return (
    <ListItem>
      {messageData.speaks == "me" && (
        <ListItemAvatar>
          {" "}
          <Avatar>
            {" "}
            <ImageIcon />{" "}
          </Avatar>{" "}
        </ListItemAvatar>
      )}
      <ListItemText
        primary={Parser(messageData.msg ? messageData.msg.text.text : messageData.message)
          
        }
      />
      {messageData.speaks == "bot" && (
        <ListItemAvatar>
          {" "}
          <Avatar>
            {" "}
            <ImageIcon />{" "}
          </Avatar>{" "}
        </ListItemAvatar>
      )}
    </ListItem>
  );
}

function onAcceptRequest(incomingRequest, appConnection, dispatcher) {
  //Adding chat to Chatlist
  dispatcher({ type: ADD_ACTIVE_CHAT, payload: incomingRequest });
  //Removing chat from Incoming Request section
  dispatcher({
    type: INCOMING_REQUEST_DELETE,
    payload: incomingRequest.data.activeSocketId,
  });
  //Loading Chat to LiveChat Section
  dispatcher({
    type: LOAD_LIVE_CHAT,
    payload: {
      messages: incomingRequest.data.transcript,
      room_id: incomingRequest.data.activeSocketId,
      displayName: incomingRequest.data.username
    },
  });
  //informing client about request acceptance
  appConnection.socket.emit("human_initiate", incomingRequest);
  //Adding chat to localStorage
  localStorage.setItem(
    incomingRequest.data.activeSocketId,
    JSON.stringify(incomingRequest.data.transcript)
  );
  //Disable chat preview
  dispatcher({ type: DISABLE_CHAT_PREVIEW });
}

function onRejectRequest(incomingRequest, appConnection, dispatcher) {
  //Removing chat from Incoming Request section
  dispatcher({
    type: INCOMING_REQUEST_DELETE,
    payload: incomingRequest.data.activeSocketId,
  });
  //Disabling chat preview
  dispatcher({ type: DISABLE_CHAT_PREVIEW });
    //Emmiting event to server
    appConnection.socket.emit('human_reject', {operatorId: appConnection.socket.id, requestId: incomingRequest.data.activeSocketId})

}

function onCancleRequest(incomingRequest, appConnection, dispatcher) {
  //Disabling chat preview
  dispatcher({ type: DISABLE_CHAT_PREVIEW });
}

export default function LiveChatPreviewChat(props) {
  //Redux Subscription
  //Redux Subscription
  const appConnection = useSelector((state) => state.appConnection);
  const chatPreview = useSelector((state) => state.chatPreview);
  const dispatcher = useDispatch();

  const [messages, setmessages] = useState([]);
  const [isAcceptedByOther, setisAcceptedByOther] = useState(false)

  useEffect(() => {
    appConnection.socket.on("human_accepted", data=>{
      //Closing Preview if open
     setisAcceptedByOther(true) 
    })
  
  }, [])

  useEffect(() => {
    setisAcceptedByOther(false) 
    //Generate or Filter Chat History Accordingly
    const chatHistory = chatPreview.incomingRequest.data.transcript.map(
      (e) => e
    );
    //Re-Populate message state with new history array
    setmessages(chatHistory);
    return function () {
      //Remove old socket handler
      // appConnection.socket.off("human_talk");
    };
  }, [chatPreview.incomingRequest]);

  const showChatPreview = ()=>{
    return(
      <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column",
        backgroundColor: "orange",
        marginLeft: "-16px",
        paddingBottom: "1px",
        background:
          "linear-gradient(0.25turn,rgb(144 115 77),rgb(160 132 92), rgb(237 219 195))!important",
      }}
    >
      {/* HEADER START */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          flex: "0 1 auto",
          bgcolor: "transparent",
          height: "60px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "space-between",
            paddingLeft: "20px",
          }}
        >
          <p sx={{ flex: "1 1 auto" }}>
            {!isAcceptedByOther?
             `Preview : [${chatPreview.incomingRequest.data.username}]`:
             `Issue No Longer Available!`
             }
          </p>
          <IconButton
            onClick={() =>
              onCancleRequest(
                chatPreview.incomingRequest,
                appConnection,
                dispatcher
              )
            }
            sx={{ flex: "0 1 10px" }}
            color="primary"
            aria-label="Cancle"
            component="span"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      {/* HEADER ENDS */}
      {/* MAIN START */}
      <Box
        sx={{
          background:
            "url(https://hermesbetahr.workflo.ai:8094/dev_chatbot/static/media/chat_bg_bot-light.abc7b484.jpg)",
          backgroundSize: "cover",
          //bgcolor: 'transparent',
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
          flex: "1 1 auto",
          display: "flex",
          overflowY: "hidden",
          height: "calc(100% - 120px)",
        }}
      >
     {!isAcceptedByOther ?   (<List
          sx={{
            bgcolor: "transparent",
            width: "100%",
            position: "inherit",
            overflowY: "scroll",
            overflowWrap: "break-word",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {messages.map((e) => createMessage(e))}
        </List>) : <p className={style.infoText}>Someone else has taken this Issue. You can <span className={style.closeSpan} onClick={() =>
              onCancleRequest(
                chatPreview.incomingRequest,
                appConnection,
                dispatcher
              )
            }>close the Preview now.</span></p>}
      </Box>
      {/* MAIN ENDS */}

      {/* BOT INPUT START */}

      <Box className={style.inputWrapper}>
        {!isAcceptedByOther && (<Grid sx={{ width: "100%" }}>
          <ButtonGroup
            variant="contained"
            size="small"
            aria-label="outlined primary button group"
          >
            <Button
              onClick={() =>
                onAcceptRequest(
                  chatPreview.incomingRequest,
                  appConnection,
                  dispatcher
                )
              }
            >
              Accept
            </Button>
            <Button
              onClick={() =>
                onRejectRequest(
                  chatPreview.incomingRequest,
                  appConnection,
                  dispatcher
                )
              }
            >
              Reject
            </Button>
          </ButtonGroup>
        </Grid>)}
      </Box>
      {/* BOT INPUT ENDS */}
    </Box>
    )
  }
 

  return (<>
  { showChatPreview()}
  </>    
  );
}
