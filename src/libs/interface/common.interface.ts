export type ItemType = 'folder' | 'file';

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
