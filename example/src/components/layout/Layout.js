import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import ChatPreview from "../chat-preview/ChatPreview";
import ChatPreview from "../chat-preview/ChatPreview";
import UserList from "../ChatList/ChatList";
import MainHeader from "../Header/Header";
import LiveChat from "../livechat/LiveChat";
import SplitBar from "../SplitBar.js/SplitBar";
import style from "./layout.module.css";
import Alert from "@mui/material/Alert";
import { Profile } from "../Profile/Profile";

export default function Layout() {
  const [activeRoom, setactiveRoom] = useState("");
  const liveChat = useSelector((state) => state.liveChat);
  const chatPreview = useSelector((state) => state.chatPreview);
  const viewProfile = useSelector((state) => state.userDetails.viewProfile);


  return (
    <>
      <Grid container spacing={2}>
        <MainHeader></MainHeader>
      </Grid>

      {viewProfile && (
        <Grid
          sx={{
            height: "calc(100vh - 60px)",
            backgroundSize: "cover",
            border: "1px solid",
            borderColor: "divider",
            background: "white",
          }}
          container
          spacing={2}
        >
          <Profile />
        </Grid>
      )}

      <Grid
        sx={{
          height: "calc(100vh - 60px)",
          backgroundSize: "cover",
          border: "1px solid",
          borderColor: "divider",
          background: "white",
          display: viewProfile? 'none' : 'flex'
        }}
        container
        spacing={2}
      >
            <Grid item xs={3} className={style.gridBorder}>
              <UserList setactiveRoom={setactiveRoom}></UserList>
            </Grid>
            <Grid item xs={5} className={style.gridBorder}>
              {liveChat.version == "active_chat" && !chatPreview.enabled && (
                <LiveChat
                  version="active_chat"
                  activeRoom={activeRoom}
                ></LiveChat>
              )}
              {liveChat.version == "" && !chatPreview.enabled && (
                <Alert className={style.noRequestInfo} severity="info">
                  Waiting for a request to be accepted!
                </Alert>
              )}
              {chatPreview.enabled && <ChatPreview></ChatPreview>}
            </Grid>
            <Grid item xs={4} className={style.gridBorder}>
              <SplitBar setactiveRoom={setactiveRoom}></SplitBar>
            </Grid>
      </Grid>
    </>
  );
}
