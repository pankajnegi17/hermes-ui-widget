import React, { useState, useEffect, useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import UserIcon from '@mui/icons-material/AccountCircle';
import AgentIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import { Grid, Icon, Input, IconButton } from "@mui/material"; 
import { SendAndArchiveOutlined } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import style from "./liveChat.module.css";
import Box from "@mui/material/Box";
import { DELETE_ACTICE_CHAT } from "../../redux/actions/activeChatsActions";
import { DELETE_LIVE_CHAT, LOAD_LIVE_CHAT } from "../../redux/actions/liveChatActions";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from "@mui/icons-material/Close";
import Parser from "html-react-parser";

function createMessage(messageData) {
  return (
    <ListItem className={`${style.listItemWrapper} ${messageData.speaks == "me"? style.listItemWrapperMe: style.listItemWrapperUser}`}>
      {console.log(messageData)}
      {messageData.speaks == "me" && (
        <>
            <ListItemAvatar sx={{  verticalAlign: "top" }}>
            {" "}
            <Avatar sx={{bgcolor: "#ffa500", color: 'black', boxShadow: '2px 2px 9px 1px #889999' }}>
              {" "}
              <UserIcon />{" "}
            </Avatar>{" "}
          </ListItemAvatar>
            <ListItemText
            className={style.messageItemMe}
            primary={
             Parser( messageData.msg ? messageData.msg.text.text : messageData.message)
            }
            autoFocus
          />
 
      
        </>
      )}
      {messageData.speaks == "bot" && (
        <>
            <ListItemAvatar sx={{ verticalAlign: "top" }}>
            {" "}
            <Avatar sx={{ boxShadow: '2px 2px 9px 1px #889999', bgcolor: "#000000", color: 'orange' }}>
              {" "}
              <SmartToyIcon></SmartToyIcon>{" "}
            </Avatar>{" "}
          </ListItemAvatar>
          <ListItemText
            className={style.messageItemUser}
            primary={
              Parser(messageData.msg ? messageData.msg.text.text : messageData.message)
            }
          />
         
        </>
      )}
      {!messageData.speaks && (
        <>
          <ListItemText
            sx={{ textAlign: "right", paddingRight: "10px", bgcolor: "white", opacity: '0.7', padding: "7px", borderRadius: "25px", borderBottomRightRadius: "2px", marginRight: "10px", boxShadow: "2px 2px 9px 1px #8e8272", marginLeft: "60px",  }}
            primary={messageData.message}
          />
          <ListItemAvatar>
            {" "}
            <Avatar sx={{ boxShadow: '2px 2px 9px 1px #889999', bgcolor: "#000000", color: 'orange' }}>
              {" "}
              <AgentIcon />{" "}
            </Avatar>{" "}
          </ListItemAvatar>
        </>
      )}
    </ListItem>
  );
}

function addMessageToLocalStorage(data) {
  const old_chat_string = localStorage.getItem(data.room_id);
  const old_chat = JSON.parse(old_chat_string);
  old_chat.push(data.messageData);
  localStorage.setItem(data.room_id, JSON.stringify(old_chat));
}

export default function LiveChat(props) {
  //Redux Subscription
  const appConnection = useSelector((state) => state.appConnection);
  const liveChat = useSelector((state) => state.liveChat);
  const dispatcher = useDispatch();
  const [messages, setmessages] = useState([]);
  const [userInput, setuserInput] = useState("");
  const activeChats = useSelector(state => state.activeChats)
  const chat_box_ref = useRef()


  const scrollToBottom = () => {  
    if (chat_box_ref) { 
      chat_box_ref.current.scrollTop = chat_box_ref.current.scrollHeight - chat_box_ref.current.clientHeight;
    }
  };


  const onCloseIssueClick = (room_id) => {
    appConnection.socket.emit("issue_closed", { room_id });
    //Adding chat to Chatlist
    dispatcher({ type: DELETE_ACTICE_CHAT, payload: { clientSocketId: room_id} });
    //Loding Previous live chat (index 0) if exists inActive chats 
    if(activeChats.length > 1){
      //Get Chat history of first Chat
      let firstActiveChat = activeChats[0];
      //Check if first chat is same as the closing one
      if(firstActiveChat.data.activeSocketId == room_id){
        firstActiveChat = activeChats[1];
      }

      const chatHistory = {
        room_id: firstActiveChat.data.activeSocketId,
        messages: JSON.parse(localStorage.getItem(firstActiveChat.data.activeSocketId)),
        displayName: firstActiveChat.data.username
      };
      dispatcher({ type: LOAD_LIVE_CHAT, payload: chatHistory });
    }
    else{
      dispatcher({type: DELETE_LIVE_CHAT});
    }
  };

 
 
  useEffect(() => {
    //Generate or Filter Chat History Accordingly
    if (liveChat.messages.length > 0) {
    const chatHistory = liveChat.messages.map((e) => e);
    //Re-Populate message state with new history array
    setmessages(chatHistory);
  }
    //Assign a fresh handler with updated room_id 
    appConnection.socket.on("human_talk", (data) => {
      if (liveChat.room_id == data.room_id) {
        console.log(`liveChat.room_id : ${liveChat.room_id}`);
        setmessages((prevMessages) => [...prevMessages, data.messageData]);
        scrollToBottom()
      }
      addMessageToLocalStorage(data);
    });
    return function () {
      //Remove old socket handler
      appConnection.socket.off("human_talk");
    };
  }, [liveChat.room_id]);

  const generateMessageData = (data, type="text", speaks="bot")=>{
    switch(type){
      case "text":{
        return{
          msg:{text:{ text:data  } },
          speaks
         } 
      }

      default:{
        return{
          msg:{text:{ text: "Unsupported Message type."  } },
          speaks
         } 
      }
    }

  }

  const sendMessage = ()=>{ 
      appConnection.socket.emit("human_talk", {
        messageData: generateMessageData(userInput),
        room_id: liveChat.room_id,
      });
      setmessages((prevMessages) => [
        ...prevMessages,
        generateMessageData(userInput),
      ]);
      addMessageToLocalStorage({
        messageData: generateMessageData(userInput),
        room_id: liveChat.room_id,
      }); 
      setuserInput("");
      scrollToBottom()
  }


  return (
    <Box
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexFlow: "column",
      backgroundColor: "orange", 
      marginLeft: "-16px",
      paddingBottom: "1px",
      background: "linear-gradient(0.25turn,rgb(237 219 195),rgb(243 178 84), rgb(237 219 195)) !important",
    }}>
      {/* HEADER START */}
      <Box sx={{ borderBottom: 1, borderColor: "divider",flex: "0 1 auto", bgcolor: 'transparent', height:'60px' }}>
        <Box sx={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between', paddingLeft: '20px'}}>
          <p sx={{ flex: "1 1 auto"}}>USER :  [{liveChat.displayName}]</p>
          <IconButton
          onClick={() => onCloseIssueClick(liveChat.room_id)}
          sx={{ flex: "0 1 10px"}}
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
          background: "url(https://hermesbetahr.workflo.ai:8094/dev_chatbot/static/media/chat_bg_bot-light.abc7b484.jpg)",
          backgroundSize: "cover",
          //bgcolor: 'transparent',
          borderBottom: 1, borderColor: "divider",
          width: "100%",
          // flex: "1 1 auto",
          display: "flex",
          overflowY: 'hidden', 
          height: 'calc(100% - 120px)'
        }}
      >
          <List ref={chat_box_ref} sx={{ bgcolor: "transparent", width: '100%',  position: 'inherit', overflowY: 'scroll', overflowWrap: 'break-word', scrollBehavior: 'smooth', '&::-webkit-scrollbar': {
            display: 'none'
        },}}>
            {messages.length>0 ? messages.map((e) => createMessage(e)) : <ListItemText sx={{ textAlign: "center", bgcolor: "white", opacity: '0.7', padding: "50px 5px", borderRadius: "25px", margin: "10px", marginTop: "50%", boxShadow: "2px 2px 9px 1px #8e8272", }}  primary = "Hay! You don't have Support Work" secondary="Take a nap :-)"/> }
          </List>
      </Box>
      {/* MAIN ENDS */}

      {/* BOT INPUT START */}

      <Box className={style.inputWrapper}>
        <Grid sx={{ width: '100%'}}>
          <Input
            sx={{ width: '100%', paddingLeft: '20px', paddingRight: '10px'}}
            value={userInput}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                sendMessage()
              }
            }}
            onChange={(e) => {
              setuserInput(e.target.value);
            }}
            placeholder="Input your message"
          ></Input>
        </Grid>
        <Grid sx={{ width: '10%'}}>
          <SendAndArchiveOutlined
            onClick={() =>  sendMessage()}
          ></SendAndArchiveOutlined>
        </Grid>
      </Box>
      {/* BOT INPUT ENDS */}
    </Box>
  );
}
