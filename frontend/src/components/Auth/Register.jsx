import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { Backdrop, CircularProgress, TextField } from "@mui/material";


function Register() {
    const [user, setUser] = useState({
        name: "",
        username: "",
        password: ""
    })
    const [picture, setPic] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    function handleChange(event) {
        const { name, value } = event.target;
        setUser((prevItem) => {
            return {
                ...prevItem,
                [name]: value
            };
        })
    }

    const PostDetails = (pic) => {
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "Coride Chat");
        data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
        fetch(process.env.REACT_APP_CLOUD_URL, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.url.toString());
                setPic(data.url.toString());
                setLoading(false);
            }).catch(error => {
                console.log(error);
            })
    }

    async function handleClick() {
        if (user.name == "" || user.username == "" || user.password == "" || picture == "") {
            alert("Please fill all the fields!!");
            return;
        }
        setLoading(true);
        const newUser = {
            name: user.name,
            username: user.username,
            password: user.password,
            picture: picture,
        }
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(newUser),
            });
            const result = await response.json();
            if (result.status===200) {
                localStorage.setItem("user", JSON.stringify({user: result.user, token: result.token.access}));
                navigate("/welcome");
            } else {
                alert(result?.message);
            }
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false)
        }
    }

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: 5 }}
                open={isLoading}
            >
                <CircularProgress color="secondary" />
            </Backdrop>

            <div className="signup-comp">
                <h1>Sign Up to Proceed</h1>
                <div className="register-form-box">
                    <TextField required={true} fullWidth margin="normal" label="Name" type="name" onChange={handleChange} className="form-email" name="name" value={user.name} />
                    <TextField required={true} fullWidth margin="normal" label="Email" type="email" onChange={handleChange} className="form-email" name="username" value={user.username} />
                    <TextField required={true} fullWidth margin="normal" label="Password" type="password" onChange={handleChange} className="form-password" name="password" value={user.password} />
                    <div className="picture-input-container">
                        <label >Picture:</label>
                        <div className="picture-input-div">
                            <input type="file" accept="image/*" onChange={(e) => PostDetails(e.target.files[0])} id="form-picture" />
                        </div>
                    </div>
                    <button type="submit" onClick={handleClick} className="btn-register">SignUp</button>
                </div>
            </div>
        </>
    )
}

export default Register;
