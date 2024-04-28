import { Avatar } from '@chakra-ui/react';
import "./ChatsBox.css";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useChat } from '../../../context/ChatContext';


function ChatsBox() {
    const navigate = useNavigate();
    const darkTheme = useSelector((state) => state.darkMode);
    const { chats, setSelectedChat } = useChat();

    return (
        <div className={"panel-chats-container" + (darkTheme ? " dark-theme-font" : "")}>
            <div className="panel-chats-box">
                {chats.map((chat) => {
                    return (
                        <div key={chat.id} className={"chat-box" + (darkTheme ? " dark-chat-box" : "")} onClick={() => {
                            setSelectedChat(chat);
                            navigate("/chat");
                        }}>
                            <div className="chat-avatar">
                                <Avatar src={chat.picture_path} name={chat.name} />
                            </div>
                            <div className="chat-name-and-desc">
                                <h3>{chat.name}</h3>
                                <div className='last-message'>
                                    <p>Last active:</p>
                                    <p>{chat.edited_at.split("T")[0]}&nbsp;{chat.edited_at.split("T")[1].split(".")[0]}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ChatsBox;