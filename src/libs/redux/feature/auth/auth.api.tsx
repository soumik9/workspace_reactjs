import { apiSlice } from "../../store/api.slice";
import { setCredential, setUser } from "./auth.slice";
import type { IApiResponse, ILoginRequest, IRegisterRequest, IUser } from "../../../interface/auth.interface";
import type { IAuthState } from "../../../interface/auth.interface";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // LOGIN
        login: builder.mutation({
            query: (body) => ({
                url: "user/login",
                method: "POST",
                body
            }),
            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                try {
                    const { data: response } = await queryFulfilled;
                    const { access_token, ...user } = response.data;
                    dispatch(setCredential({ user, accessToken: access_token }));
                } catch {
                    // The form displays the mutation error.
                }
            },
        }),
        // REGISTER
        register: builder.mutation({
            query: (body) => ({
                url: "user/register",
                method: "POST",
                body
            }),
        }),

        // GET PROFILE
        getProfile: builder.query<IApiResponse<IUser>, string>({
            query: () => ({
                url: "user/profile",
                method: "GET"
            }),
            async onQueryStarted(token, { queryFulfilled, dispatch, getState }) {
                try {
                    const { data: response } = await queryFulfilled;
                    const { accessToken } = (getState() as unknown as { auth: IAuthState }).auth;
                    if (accessToken === token) dispatch(setUser(response.data));
                } catch {
                    // Authentication errors are handled by the base query.
                }
            },
            providesTags: ["Profile"],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } = authApi;
