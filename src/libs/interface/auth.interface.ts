export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: 'user';
    created_at: number;
}

export interface IApiResponse<T> {
    status_code: number;
    success: boolean;
    message: string;
    data: T;
}

export interface IAuthState {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

export interface ICredentials {
    user: IUser;
    accessToken: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest extends ILoginRequest {
    name: string;
}
