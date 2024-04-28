import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state)=>{
            return state = !state;
        }
    }
});

export const {toggleDarkMode} = darkModeSlice.actions;
export default darkModeSlice.reducer;