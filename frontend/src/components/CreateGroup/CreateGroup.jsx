import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import "./CreateGroup.css";
import { useState } from "react";
import { Avatar } from "@chakra-ui/react";
import { useChat } from "../../context/ChatContext";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

function CreateGroup() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const darkTheme = useSelector((state) => state.darkMode);
  const { chats, setChats, setSelectedChat } = useChat();

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement.closest('.search-results')) {
        setShow(false);
      }
    }, 0);
  }

  const fetchUsers = async (e) => {
    setUser(e.target.value);
    const userInfo = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/search?search=${e.target.value}&user=${userInfo.user._id}`, {
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
        setUsers(result.data);
        setShow(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const addUser = (newuser) => {
    setSelectedUsers([...selectedUsers, newuser]);
    setUser("");
  }

  const removeSelectedUser = (index) => {
    const newData = [...selectedUsers];
    newData.splice(index, 1);
    setSelectedUsers(newData);
  }

  async function createNewGroup() {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const userIds = selectedUsers.map(el => {
      return el.id;
    })
    const data = {
      user: userInfo.user._id,
      name: name,
      userIds: userIds
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/group", {
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
        setChats([result.data, ...chats]);
        setSelectedUsers([]);
        setName("");
      }
      else{
        enqueueSnackbar(result?.message, {variant:"warning"})
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className={"create-group-container" + (darkTheme ? " dark-create-div" : "")}>
      <div className="return-arrow-div">
        <KeyboardBackspaceIcon titleAccess="back" className={"return-arrow" + (darkTheme ? " dark-theme-font" : "")} onClick={() => {
          setSelectedChat();
          navigate("/welcome");
        }} /> <span className={darkTheme ? " dark-theme-font" : null}>Return</span>
      </div>
      <input type="text" placeholder="Enter group name" className="create-group-name-input" value={name} onChange={(e) => setName(e.target.value)} />

      <div className="add-members">
        <div className="create-group-search-bar">
          <input type="text" placeholder="Group Members" className="create-group" value={user} onChange={fetchUsers} onBlur={handleBlur} />
        </div>
        {show && <div className="searched-groups">
          {
            users.map((el, index) => {
              return (
                <>
                  <div key={index} className="searched-names" onMouseDown={() => addUser({ id: el.id, name: el.name })}>
                    <div className="searched-user-image">
                      <Avatar src={el.picture} name={el.name} />
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

      {selectedUsers.length > 0 && <div className="selected-user-cards-container">
        {
          selectedUsers.map((el, index) => {
            return <div className="selected-user-cards" key={index} onClick={() => removeSelectedUser(index)}>{el.name}</div>
          })
        }
      </div>}

      <Button className="create-group-btn" title="Create Group" onClick={createNewGroup}>
        Create
      </Button>
    </div>
  )
}

export default CreateGroup;