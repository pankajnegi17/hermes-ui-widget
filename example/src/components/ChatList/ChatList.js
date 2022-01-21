import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import UserIcon from "@mui/icons-material/Face";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { useSelector, useDispatch } from "react-redux";
import { LOAD_LIVE_CHAT } from "../../redux/actions/liveChatActions"; 
export default function UserList(props) {
  //Redux Subscriptions
  const activeChats = useSelector((state) => state.activeChats);
  const dispatcher = useDispatch();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onActiveChatSelect = (chat, index) => {
    setSelectedIndex(index);
    props.setactiveRoom(chat.data.activeSocketId);
    const chatHistory = {
      room_id: chat.data.activeSocketId,
      messages: JSON.parse(localStorage.getItem(chat.data.activeSocketId)),
      displayName: chat.data.username
    };
    dispatcher({ type: LOAD_LIVE_CHAT, payload: chatHistory });
  };
 
  React.useEffect(() => {
    setSelectedIndex(activeChats.length - 1);
  }, [activeChats]);
  return (
    <List sx={{ width: "100%", maxWidth: 360}}>
      {activeChats.map((chat, index) => (
        <ListItem
          onClick={() => onActiveChatSelect(chat, index)}
          selected={selectedIndex === index}
          sx={{ bgcolor: "background.paper" }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "#ffa500", color: 'black', boxShadow: '2px 2px 9px 1px #889999' }}>
 
              <UserIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={chat.data.username} secondary="" />
        </ListItem>
      ))}
    </List>
  );
}
