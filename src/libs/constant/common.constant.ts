import { FaFolderPlus, FaPlus } from 'react-icons/fa';
import type { ItemType } from '../interface/common.interface';
import type { IconType } from 'react-icons';

export const LOCAL_STORAGE_KEYS = {
  WORKSPACE_STATE: 'workspace-state',
};

export const ITEM_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
} as const;

export const TOOLBAR_ACTIONS: { type: ItemType; label: string; icon: IconType }[] = [
  { type: ITEM_TYPES.FOLDER, label: 'New Folder', icon: FaFolderPlus },
  { type: ITEM_TYPES.FILE, label: 'New File', icon: FaPlus },
];
