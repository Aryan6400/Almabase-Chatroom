import React, { useState } from "react";
import { Grid, GridItem} from "@chakra-ui/react";
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from "react-redux";
import "./Input.css";

function InputChat({onSubmit}) {
    const darkTheme = useSelector((state)=>state.darkMode);
    const [newChat, setnewChat] = useState("");

    function handleChange(event) {
        setnewChat(event.target.value);
    }

    function triggerSendMessage(e){
        if(e.key === "Enter" && newChat){
            handleSubmit();
        }
    }

    function handleSubmit(){
        onSubmit(newChat);
        setnewChat("");
    }

    

    return (
        <Grid templateColumns="auto 55px" className={"inputBox" + (darkTheme ? " dark-input" : "")}>
            <GridItem>
                <input id="chat-input" className={darkTheme ? "dark-input" : ""} type="text" onKeyDown={triggerSendMessage} onChange={handleChange} placeholder="Reply" name="chat" value={newChat} />
            </GridItem>
            <GridItem
                justifySelf="center"
                alignSelf="center"
                padding="13px 15px"
            >
                <SendIcon onClick={handleSubmit} />
            </GridItem>
        </Grid>
    )
}

export default InputChat;