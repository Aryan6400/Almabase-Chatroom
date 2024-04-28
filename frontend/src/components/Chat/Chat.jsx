import React, {useRef, useEffect} from "react";
import "./Chat.css";
import { Avatar, AvatarBadge, Grid, GridItem } from '@chakra-ui/react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useSelector } from "react-redux";


function Chat({ data }) {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const scrollableDivRef = useRef(null);
    const darkTheme = useSelector((state) => state.darkMode);

    useEffect(() => {
        scrollableDivRef.current?.scrollIntoView({ behaivour: "smooth" });
    }, [data])

    return (
        <div className={"chat-big-box "} ref={scrollableDivRef}>
            <div className={"chat " + (!darkTheme ? "" : "dark-panel")}>
                <Grid templateColumns="1fr 14fr" gap="0.5rem" className={userInfo.user._id == data.sender.id ? "myChats" : "chats"}>
                    <GridItem
                        justifySelf="left"
                        alignSelf="start"
                        className="avatar"
                    >
                        {userInfo.user._id != data.sender.id && <Avatar src={data.sender.picture} name="Profile Picture" >
                            <AvatarBadge >
                                <VerifiedIcon id="verified-icon-svg"/>
                            </AvatarBadge>
                        </Avatar>}
                    </GridItem>
                    <GridItem
                        fontSize="1.2rem"
                    >
                        <div className={userInfo.user._id == data.sender.id ? `myChatText ${darkTheme && "my-dark-chat"}` : `chatText ${darkTheme && "dark-chat"}`}>
                            {userInfo.user._id != data.sender.id
                                ?
                                <div className="sender-name-time">
                                    <span className="sender-name">{data.sender.name}</span>
                                    <span  className="sender-chat">{data.created_at.split("T")[1].split(".")[0].slice(0, 5)}</span>
                                </div>
                                :
                                <div className="sender-name-time">
                                    <span></span>
                                    <span  className="sender-chat">{data.created_at.split("T")[1].split(".")[0].slice(0, 5)}</span>
                                </div>
                            }
                            <div>{data.text}</div>
                        </div>
                    </GridItem>
                </Grid>
            </div>
        </div>
    )
}

export default Chat;