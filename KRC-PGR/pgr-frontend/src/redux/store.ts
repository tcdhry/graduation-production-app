import { configureStore } from "@reduxjs/toolkit";
import { loginUserSlice, loginUserState } from "./userSlice";

export type State = {
    loginUser: loginUserState,
}

export const store = configureStore({
    reducer: {
        loginUser: loginUserSlice.reducer,
    },
});