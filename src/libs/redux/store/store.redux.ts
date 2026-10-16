import { apiSlice } from './api.slice';
import { authSliceReducer, logout, setCredential, setUser } from '../feature/auth/auth.slice';
import { LocalStorageKeyEnum } from '../../enum/common.enum';
import { removeLocalStorage } from '../../helper/local_storage.helper';
import type { Middleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { WorkspaceState } from '../../interface/common.interface';
import { workspaceReducer } from '../feature/workspace/workspace.slice';
import { getLocalStorageData, setLocalStorageData } from '../../helper/common.helper';
import { LOCAL_STORAGE_KEYS } from '../../constant/common.constant';

// Middleware to sync state to localStorage
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    if (typeof action === 'object' && action !== null && 'type' in action && typeof action.type === 'string' && action.type.startsWith('workspace/')) {
        setLocalStorageData(LOCAL_STORAGE_KEYS.WORKSPACE_STATE, store.getState().workspace);
    }
    if (setCredential.match(action) || setUser.match(action)) {
        const { user, accessToken } = store.getState().auth;
        setLocalStorageData(LocalStorageKeyEnum.Auth, { user, accessToken });
    }
    if (logout.match(action)) {
        removeLocalStorage(LocalStorageKeyEnum.Auth);
        store.dispatch(apiSlice.util.resetApiState());
    }
    return result;
};

// Function to load initial state from localStorage
const loadState = (): { workspace: WorkspaceState } | undefined => {
    const serializedState = getLocalStorageData<WorkspaceState>(LOCAL_STORAGE_KEYS.WORKSPACE_STATE);
    if (!serializedState) {
        return undefined;
    }
    return { workspace: serializedState };
};

const preloadedState = loadState();


// main store configuration
export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        auth: authSliceReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware, localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;