import { logout } from '../auth/auth.slice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FileSystemItem, WorkspaceState } from '../../../interface/common.interface';

const initialState: WorkspaceState = {
    items: {},
    selectedFolderId: null,
    selectedFileId: null,
    searchQuery: '',
};

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<FileSystemItem[]>) => {
            state.items = Object.fromEntries(action.payload.map(item => [item._id, item]));

            if (state.selectedFolderId && !state.items[state.selectedFolderId])
                state.selectedFolderId = null;

            if (state.selectedFileId && !state.items[state.selectedFileId])
                state.selectedFileId = null;
        },
        addItem: (state, action: PayloadAction<FileSystemItem>) => {
            state.items[action.payload._id] = action.payload;
        },

        deleteItem: (state, action: PayloadAction<string>) => {
            const idToDelete = action.payload;
            const parent = state.items[idToDelete]?.parent ?? null;

            // Helper to recursively collect all children IDs
            const getChildrenIds = (parent: string): string[] => {
                const children = Object.values(state.items).filter(item => item.parent === parent);
                return children.reduce((acc, child) => {
                    return [...acc, child._id, ...getChildrenIds(child._id)];
                }, [] as string[]);
            };

            // remove the item and all its children & if edit file select then set to null for non select
            const idsToRemove = [idToDelete, ...getChildrenIds(idToDelete)];
            idsToRemove.forEach(id => {
                delete state.items[id];
                if (state.selectedFolderId === id) state.selectedFolderId = parent;
                if (state.selectedFileId === id) state.selectedFileId = null;
            });
        },

        selectFolder: (state, action: PayloadAction<string | null>) => {
            state.selectedFolderId = action.payload;
            state.selectedFileId = null;
        },

        selectFile: (state, action: PayloadAction<string | null>) => {
            state.selectedFileId = action.payload;
        },

        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => initialState);
    },
});

export const {
    setItems,
    addItem,
    deleteItem,
    selectFolder,
    selectFile,
    setSearchQuery,
} = workspaceSlice.actions;

export const workspaceReducer = workspaceSlice.reducer;
