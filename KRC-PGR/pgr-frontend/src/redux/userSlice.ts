import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserBean } from "../beans/UserBean";

/**
 * state.user
 * 非ログイン時:null
 * ログイン時　:User
 */
export type loginUserState = { user: UserBean | null; };
const initialUserState: loginUserState = { user: null };

export const loginUserSlice = createSlice({
    name: 'loginUser',
    initialState: initialUserState,
    reducers: {
        login(state: loginUserState, action: PayloadAction<UserBean>) {
            state.user = action.payload;
        },
        logout(state: loginUserState) {
            return initialUserState;
        }
    },
});