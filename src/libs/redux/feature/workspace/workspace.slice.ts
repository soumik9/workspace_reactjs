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
        setInitialState: (state, action) => {
            return action.payload;
        },

        addItem: (state, action: PayloadAction<FileSystemItem>) => {
            state.items[action.payload.id] = action.payload;
        },

        renameItem: (state, action: PayloadAction<{ id: string; name: string }>) => {
            if (state.items[action.payload.id]) {
                state.items[action.payload.id].name = action.payload.name;
            }
        },

        deleteItem: (state, action: PayloadAction<string>) => {
            const idToDelete = action.payload;

            // Helper to recursively collect all children IDs
            const getChildrenIds = (parentId: string): string[] => {
                const children = Object.values(state.items).filter(item => item.parentId === parentId);
                return children.reduce((acc, child) => {
                    return [...acc, child.id, ...getChildrenIds(child.id)];
                }, [] as string[]);
            };

            // remove the item and all its children & if edit file select then set to null for non select
            const idsToRemove = [idToDelete, ...getChildrenIds(idToDelete)];
            idsToRemove.forEach(id => {
                delete state.items[id];
                if (state.selectedFolderId === id) state.selectedFolderId = state.items[idToDelete]?.parentId || null;
                if (state.selectedFileId === id) state.selectedFileId = null;
            });
        },

        updateFileContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
            if (state.items[action.payload.id] && state.items[action.payload.id].type === 'file') {
                state.items[action.payload.id].content = action.payload.content;
            }
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
});

export const {
    setInitialState,
    addItem,
    renameItem,
    deleteItem,
    updateFileContent,
    selectFolder,
    selectFile,
    setSearchQuery,
} = workspaceSlice.actions;

export const workspaceReducer = workspaceSlice.reducer;
