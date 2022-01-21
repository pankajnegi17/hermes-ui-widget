import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { ADD_ACTIVE_CHAT } from "../../redux/actions/activeChatsActions";
import { INCOMING_REQUEST_DELETE } from "../../redux/actions/incomingRequestActions";
import { LOAD_LIVE_CHAT } from "../../redux/actions/liveChatActions";
import { DISABLE_CHAT_PREVIEW, ENABEL_CHAT_PREVIEW } from "../../redux/actions/chatPreviewActions";
import Alert from '@mui/material/Alert';
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

function onPreviewRequest(incomingRequest, appConnection, dispatcher) {
  //Loading Chat to LiveChat Section
  dispatcher({ type: ENABEL_CHAT_PREVIEW, payload: incomingRequest });
}

function onRejectRequest(incomingRequest, appConnection, dispatcher) {
  //Removing chat from Incoming Request section
  dispatcher({
    type: INCOMING_REQUEST_DELETE,
    payload: incomingRequest.data.activeSocketId,
  });
    //Disable chat preview
    dispatcher({ type: DISABLE_CHAT_PREVIEW });

    //Emmiting event to server
    appConnection.socket.emit('human_reject', {operatorId: appConnection.socket.id, requestId: incomingRequest.data.activeSocketId})
}

function getActionButtons(incomingRequest, appConnection, dispatcher) {
  return (
    <ButtonGroup
      variant="contained"
      size="small"
      aria-label="outlined primary button group"
    >
      <Button
        onClick={() =>
          onPreviewRequest(incomingRequest, appConnection, dispatcher)
        }
      >
        Preview
      </Button>
      <Button
        onClick={() =>
          onAcceptRequest(incomingRequest, appConnection, dispatcher)
        }
      >
        Accept
      </Button>
      <Button
        onClick={() =>
          onRejectRequest(incomingRequest, appConnection, dispatcher)
        }
      >
        Reject
      </Button>
    </ButtonGroup>
  );
}

function getRequestItem(incomingRequest, appConnection, dispatcher) {
  return (
    <>
    <ListItem key={incomingRequest.data.activeSocketId} alignItems="flex-start" sx={{paddingLeft: '0px'}}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={incomingRequest.data.username}
        secondary={getActionButtons(incomingRequest, appConnection, dispatcher)}
      />
    </ListItem>
    <Divider variant="inset" component="li" />
    </>
  );
}

export default function IncomingRequests(props) {
  const incomingRequests = useSelector((state) => state.incomingRequest);
  const appConnection = useSelector((state) => state.appConnection);
  const dispatcher = useDispatch();

  useEffect(() => {
    appConnection.socket.on("human_accepted", data=>{
      dispatcher({type:INCOMING_REQUEST_DELETE, payload:data.data.activeSocketId});
      //Close Preview if exist

    })
  
  }, [])

  return (
    <List sx={{ width: "100%", maxWidth: 360, }}>
      {incomingRequests.map((incomingRequest) =>
        getRequestItem(incomingRequest, appConnection, dispatcher)
      )}

      {incomingRequests.length == 0 &&  <Alert severity="info">You have 0 Requests</Alert>}
    </List>
  );
}
