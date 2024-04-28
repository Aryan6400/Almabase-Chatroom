import React from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { changePopupImage, togglePopup } from '../../Features/popupImageSlice';
import "./PopupImage.css";
import { Backdrop, CircularProgress } from "@mui/material";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImagePopup = () => {
    const dispatch = useDispatch();
    // const [pic, setPic] = useState("");
    // const [resizedPic, setResizedPic] = useState("");
    // const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { popup, popupImage } = useSelector((state) => state.popup);
    const closeModal = () => {
        dispatch(togglePopup());
        dispatch(changePopupImage(""));
    };
    
    async function changeProfile() {
    //     const data = {
    //         picture: pic,
    //         resizedPicture: resizedPic
    //     }
    //     console.log(data);
    //     const userInfo = JSON.parse(localStorage.getItem("user"));
    //     try {
    //         const response = await fetch("http://localhost:8080/profile", {
    //             method: "PATCH",
    //             cache: "no-cache",
    //             credentials: "same-origin",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${userInfo.token}`
    //             },
    //             redirect: "follow",
    //             referrerPolicy: "no-referrer",
    //             body: JSON.stringify(data),
    //         });
    //         const result = await response.json();
    //         if (result.user) {
    //             const newData={
    //                 token:userInfo.token,
    //                 user:result
    //             }
    //             localStorage.setItem("user", JSON.stringify(newData));
    //             navigate("/welcome");
    //             setLoading(false);
    //         } else {
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    }

    return (
        <>
            {/* <Backdrop
                sx={{ color: "#fff", zIndex: 5 }}
                open={isLoading}
            >
                <CircularProgress color="secondary" />
            </Backdrop> */}
            <div>
                <Modal
                    isOpen={popup}
                    onRequestClose={closeModal}
                    style={{
                        content: {
                            width: '60%',
                            height: '70%',
                            margin: 'auto',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    }}
                >
                    <img className='modal-image' src={popupImage} alt='Profile Picture' />
                    <div className='change-profile-pic-div'>
                        <input type='file' accept='image/*' />
                        <button onClick={changeProfile}>
                            Submit
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    );
};
export default ImagePopup;
