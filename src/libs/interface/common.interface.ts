import type { IWorkspaceResponse } from './workspace.interface';
import { ITEM_TYPES } from '../constant/common.constant';

export type ItemType = typeof ITEM_TYPES.FOLDER | typeof ITEM_TYPES.FILE;

export type FileSystemItem = IWorkspaceResponse;

export interface WorkspaceState {
    items: Record<string, FileSystemItem>;
    selectedFolderId: string | null; // null means root workspace
    selectedFileId: string | null;
    searchQuery: string;
}
