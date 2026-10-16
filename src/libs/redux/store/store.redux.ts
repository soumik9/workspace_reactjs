import { apiSlice } from './api.slice';
import { authSliceReducer, logout, setCredential, setUser } from '../feature/auth/auth.slice';
import { LocalStorageKeyEnum } from '../../enum/common.enum';
import { removeLocalStorage } from '../../helper/local_storage.helper';
import type { Middleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { workspaceReducer } from '../feature/workspace/workspace.slice';
import { setLocalStorageData } from '../../helper/common.helper';
import { LOCAL_STORAGE_KEYS } from '../../constant/common.constant';

// Middleware to sync state to localStorage
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    if (setCredential.match(action) || setUser.match(action)) {
        const { user, accessToken } = store.getState().auth;
        setLocalStorageData(LocalStorageKeyEnum.Auth, { user, accessToken });
    }
    if (logout.match(action)) {
        removeLocalStorage(LocalStorageKeyEnum.Auth);
        removeLocalStorage(LOCAL_STORAGE_KEYS.WORKSPACE_STATE);
        store.dispatch(apiSlice.util.resetApiState());
    }
    return result;
};

// main store configuration
export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        auth: authSliceReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware, localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;