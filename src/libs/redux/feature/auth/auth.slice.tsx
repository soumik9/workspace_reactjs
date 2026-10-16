import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IAuthState, ICredentials, IUser } from "../../../interface/auth.interface";

const initialState: IAuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredential: (state, action: PayloadAction<ICredentials>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = Boolean(action.payload.accessToken);
        },
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        logout: () => initialState,
    },
});

export const {
    setCredential,
    setUser,
    logout
} = authSlice.actions;

export const authSliceReducer = authSlice.reducer;
