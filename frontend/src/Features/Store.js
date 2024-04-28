import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import popupImageReducer from "./popupImageSlice";

export const store = configureStore({
    reducer: {
        darkMode: darkModeReducer,
        popup: popupImageReducer,
    }
})
