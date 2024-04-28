import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    popup:false,
    popupImage:""
};

export const popupImageSlice = createSlice({
    name: 'popupImage',
    initialState,
    reducers: {
        togglePopup: (state)=>{
            state.popup = !state.popup;
        },
        changePopupImage:(state, action)=>{
            state.popupImage=action.payload;
        }
    }
});

export const {togglePopup,changePopupImage} = popupImageSlice.actions;
export default popupImageSlice.reducer;