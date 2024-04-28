import "./OptionsBar.css";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Avatar } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toggleDarkMode } from "../../../Features/darkModeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useChat } from "../../../context/ChatContext";


function OptionsBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const darkTheme = useSelector((state) => state.darkMode);
    const [name, setName] = useState("");
    const [picture, setPicture] = useState("");
    const { setSelectedChat, setChats } = useChat();

    useEffect(() => {
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        setName(user.user.name);
        setPicture(user.user.picture);
    }, []);

    function logout() {
        localStorage.removeItem("user");
        setChats([]);
        setSelectedChat();
        navigate("/");
    }

    return (
        <div className={"options-container " + (!darkTheme ? "" : "dark-theme-font")}>
            <div className="user-profile">
                <div className="user-image">
                    <Avatar src={picture} name={name} />
                </div>
                <div className="username">
                    <h2 onClick={() => {
                        setSelectedChat();
                        navigate("/welcome");
                    }}>{name}</h2>
                </div>
            </div>
            <hr />
            <div className="options-div">
                <GroupAddIcon titleAccess="Join Group" onClick={() => navigate("/join")} />
                <AddCircleOutlineIcon titleAccess="Create Group" onClick={() => navigate("/create")} />
                <DarkModeIcon titleAccess="Change Theme" onClick={() => {
                    dispatch(toggleDarkMode())
                }} />
                <LogoutIcon titleAccess="Log Out" onClick={logout} />
            </div>
        </div>
    )
}

export default OptionsBar;