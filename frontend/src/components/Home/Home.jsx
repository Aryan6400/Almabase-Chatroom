import React, { useEffect, useRef, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Chat from "../Chat/Chat";
import InputChat from "../Input/Input";
import Header from "../Header/Header";
import ScrollableFeed from "react-scrollable-feed";
import "./Home.css";
import { useChat } from "../../context/ChatContext";
import { CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";

const ENDPOINT = "ws://127.0.0.1:8000/ws/chat";
let socket, selectedChatCompare;

function Home() {
  const [chats, setChats] = useState([]);
  const [mode, setMode] = useState("Online");
  const { selectedChat } = useChat();
  const [socketConnected, setSocketConnected] = useState(false);
  const scrollableDivRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function getChats() {
    setLoading(true)
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (!selectedChat) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chats/${selectedChat.id}`, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
      const result = await response.json();
      if (result.status === 200) {
        setChats(result.data);
        socket = new WebSocket(`${ENDPOINT}/${selectedChat?.id}/`)
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(socket){
      socket.onmessage = function(e){
        const data = JSON.parse(e.data)
        console.log(data['message'])
        setChats([...chats, data['message']])
      }
    }
  });

  useEffect(() => {
    getChats();
    selectedChatCompare = selectedChat;
  }, [selectedChat])

  async function sendMessage(newChat) {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const data = {
      text: newChat,
      user: userInfo.user._id
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chats/${selectedChat.id}`, {
        method: "POST",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === 201) {
        socket.send(JSON.stringify({"message": result.data}));
      }
      else {
        enqueueSnackbar(result?.message, {variant:"error"})
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid templateRows="1.5fr 8fr 1.5fr" height="90vh" gap="10px">
      <GridItem
      >
        <Header />
        {mode == "Offline" && <p style={{ "color": "red", "textAlign": "center", "backgroundColor": "#ffd400", "padding": "6px", "margin": "-10px -20px" }}>You are offline!! Go online to view new chats.</p>}
      </GridItem>
      <GridItem
        className="chatBox"
        ref={scrollableDivRef}
      >
        {loading ? <CircularProgress /> : <ScrollableFeed>
          {
            [...chats].map((chat) => {
              return (
                <Chat key={chat.id} data={chat} />
              )
            })
          }
        </ScrollableFeed>}
      </GridItem>
      <GridItem
      >
        <InputChat onSubmit={sendMessage} />
      </GridItem>
    </Grid>
  );
}

export default Home;
