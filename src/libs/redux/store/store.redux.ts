import { configureStore } from '@reduxjs/toolkit';
import type { WorkspaceState } from '../../interface/common.interface';
import { workspaceReducer } from '../feature/workspace/workspace.slice';
import { getLocalStorageData, setLocalStorageData } from '../../helper/common.helper';
import { LOCAL_STORAGE_KEYS } from '../../constant/common.constant';

// Middleware to sync state to localStorage
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    const state = store.getState().workspace;
    setLocalStorageData(LOCAL_STORAGE_KEYS.WORKSPACE_STATE, state);
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
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;