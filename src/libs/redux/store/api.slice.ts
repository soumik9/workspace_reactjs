import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../feature/auth/auth.slice";
import type { IAuthState } from "../../interface/auth.interface";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const { accessToken } = (getState() as { auth: IAuthState }).auth;
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Profile"],
    baseQuery: async (args, api, extraOptions) => {
        const token = (api.getState() as { auth: IAuthState }).auth.accessToken;
        const result = await baseQuery(args, api, extraOptions);
        const url = typeof args === "string" ? args : args.url;
        if (result.error?.status === 401 && token === (api.getState() as { auth: IAuthState }).auth.accessToken && !["user/login", "user/register"].includes(url)) {
            api.dispatch(logout());
        }
        return result;
    },
    endpoints: () => ({}),
});
