import React from "react";
import { Avatar, Grid, GridItem } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useSelector, useDispatch } from "react-redux";
import "./Header.css";
import { useChat } from "../../context/ChatContext";
import { changePopupImage, togglePopup } from "../../Features/popupImageSlice";
import { useNavigate } from "react-router-dom";

function Header() {
    const darkTheme = useSelector((state) => state.darkMode);
    const { selectedChat, setSelectedChat } = useChat();
    const navigate = useNavigate();
    const dispatch=useDispatch();

    const triggerModal = (e) => {
        const url=e.target.src;
        dispatch(togglePopup());
        dispatch(changePopupImage(url));
    }

    const isAdmin = () => {
        let userInfo = localStorage.getItem('user')
        if(userInfo){
            userInfo=JSON.parse(userInfo)
            if(selectedChat.admin.id === userInfo.user._id) return true
        }
        return false
    }

    return (
        <div className={"header" + (darkTheme ? " dark-theme-font" : "")}>
            <Grid className="name-and-avatar" templateColumns="1fr 1fr 10fr 1fr" gap="0.5rem">
                <GridItem
                    justifySelf="left"
                    alignSelf="center"
                    className="return"
                >
                    <KeyboardBackspaceIcon titleAccess="back" className="chat-return-arrow" onClick={() => {
                        setSelectedChat();
                        navigate("/welcome");
                    }}/>
                </GridItem>
                <GridItem
                    justifySelf="left"
                    alignSelf="center"
                    className="avatar"
                >
                    <Avatar src={selectedChat.picture_path} onClick={triggerModal} name={selectedChat.name} />
                </GridItem>
                <GridItem
                    paddingLeft=".75rem"
                    className="chatName"
                >
                    <span>{selectedChat.name}</span>
                </GridItem>
                <GridItem
                    justifySelf="right"
                    alignSelf="center"
                    className="chat-options"
                >
                    {isAdmin() && <EditIcon onClick={()=>navigate('/edit')} className="headingIcon" boxSize={25} />}
                </GridItem>
            </Grid>
            <hr />
        </div>
    )
}

export default Header;