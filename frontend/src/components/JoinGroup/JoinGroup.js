import { useSelector } from "react-redux";
import { useState } from "react";
import { Avatar } from "@chakra-ui/react";
import "./JoinGroup.css";
import { useChat } from "../../context/ChatContext";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

function JoinGroup() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const darkTheme = useSelector((state) => state.darkMode);
    const [groups, setGroups] = useState([]);
    const [show, setShow] = useState(false);
    const { chats, setChats, setSelectedChat } = useChat();

    const fetchGroups = async (e) => {
        setName(e.target.value)
        console.log(e.target.value)
        if(!e.target.value){
            setGroups([])
            return
        }
        const userInfo = JSON.parse(localStorage.getItem("user"));
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/group/search?search=${e.target.value}`, {
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
                setGroups(result.data);
                setShow(true);
            }
            else{
                enqueueSnackbar(result?.message, {variant:"error"})
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleBlur = () => {
        setTimeout(() => {
            if (!document.activeElement.closest('.search-results')) {
                setShow(false);
            }
        }, 0);
    }

    async function joinGroup(id) {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        const data = {
            id: id,
            user: userInfo.user._id
        }
        try {
            const response = await fetch("http://127.0.0.1:8000/api/group", {
                method: "PATCH",
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
            if (result.status===201) {
                setChats([result.data, ...chats]);
                setName('')
            }
            else{
                enqueueSnackbar(result?.message, {variant:"error"})
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={"create-group-container join-group-container" + (darkTheme ? " dark-create-div" : "")}>
            <div className="return-arrow-div">
                <KeyboardBackspaceIcon titleAccess="back" className={"return-arrow" + (darkTheme ? " dark-theme-font" : "")} onClick={() => {
                    setSelectedChat();
                    navigate("/welcome");
                }} /> <span className={darkTheme ? " dark-theme-font" : null}>Return</span>
            </div>
            <div className="join-group">
                <div className="join-group-search-bar">
                    <input type="text" placeholder="Enter group name" className="join-group-input" value={name} onChange={fetchGroups} onBlur={handleBlur} />
                </div>
                {show && <div className="searched-groups">
                    {
                        groups.map((el, index) => {
                            return (
                                <>
                                    <div key={index} className="searched-names" onMouseDown={() => joinGroup(el.id)}>
                                        <div className="searched-user-image">
                                            <Avatar src={el.picture_path} name={el.name} />
                                        </div>
                                        <div>{el.name}</div>
                                    </div>
                                    {index < 9 && <hr className="search-result-hr" />}
                                </>
                            )
                        })
                    }
                </div>}
            </div>

        </div>
    )
}

export default JoinGroup;