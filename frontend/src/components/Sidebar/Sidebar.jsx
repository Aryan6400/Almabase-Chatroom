import { Suspense, lazy } from "react";
import "./Sidebar.css";
import { useEffect } from "react";
import { useChat } from "../../context/ChatContext";

import ChatsBox from "./ChatsBox/ChatsBox";
import OptionsBar from "./OptionsBar/OptionsBar";
import ImagePopup from "../PopupImage/PopupImage";


function Sidebar() {
    const { setChats } = useChat();

    async function getChats() {
        try {
            const userInfo = JSON.parse(localStorage.getItem("user"));
            const response = await fetch(`http://127.0.0.1:8000/api/group?user=${userInfo.user._id}`, {
                method: "GET",
                cache: "no-cache",
                credentials: "same-origin",
                headers: { Authorization: `Bearer ${userInfo.token}` },
                redirect: "follow",
                referrerPolicy: "no-referrer"
            });
            const result = await response.json()
            if(result.status===200){
                setChats(result.data);
            }
            else{
                alert(result?.message)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getChats();
    }, [])

    return (
        <div className="sidebar-container">
            <div className="left-panel-head">
                <OptionsBar />
            </div>
            <div className="left-panel-box">
                <ChatsBox />
            </div>
        </div>
    )
}

export default Sidebar;