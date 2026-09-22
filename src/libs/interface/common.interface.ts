import { ITEM_TYPES } from '../constant/common.constant';

export type ItemType = typeof ITEM_TYPES.FOLDER | typeof ITEM_TYPES.FILE;

export interface FileSystemItem {
    id: string;
    name: string;
    type: ItemType;
    parentId: string | null;
    content?: string; // Only for files
}

export interface WorkspaceState {
    items: Record<string, FileSystemItem>;
    selectedFolderId: string | null; // null means root workspace
    selectedFileId: string | null;
    searchQuery: string;
}
