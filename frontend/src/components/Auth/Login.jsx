import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { enqueueSnackbar } from "notistack";


function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
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
    async function handleClick() {
        if (user.username == "" || user.password == "") {
            enqueueSnackbar("Please fill all the credentials.", {variant:"warning"});
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(user),
            });
            const result = await response.json();
            if (result.status===200) {
                localStorage.setItem("user", JSON.stringify({user: result.user, token: result.token.access}));
                navigate("/welcome");
            } else {
                enqueueSnackbar(result?.message, {variant: "error"});
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
                <h1>Login to proceed</h1>
                <div className="login-form-box">
                    <TextField required={true} fullWidth margin="normal" label="Email" type="email" onChange={handleChange} className="form-email" name="username" value={user.username} />
                    <TextField required={true} fullWidth margin="normal" label="Password" type="password" onChange={handleChange} className="form-password" name="password" value={user.password} />
                    <button type="submit" onClick={handleClick} className="btn-register">Login</button>
                </div>
            </div>
        </>
    )
}

export default Login;