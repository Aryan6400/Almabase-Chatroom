import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

function ChatProvider({children}){
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    useEffect(()=>{
        setSelectedChat((prev)=>prev);
    }, [])    
    
    return (
        <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats}}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    return useContext(ChatContext);
}

export default ChatProvider;