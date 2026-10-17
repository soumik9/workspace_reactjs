import { useUpdateWorkspaceMutation, useDeleteWorkspaceMutation } from '../../libs/redux/feature/workspace/workspace.api';
import { errorNotify, successNotify } from '../../libs/helper/notify.helper';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ItemFormModal } from '../common/ItemFormModal';
import { ITEM_TYPES } from '../../libs/constant/common.constant';
import type { RootState } from '../../libs/redux/store/store.redux';
import { FaFolder, FaFileAlt, FaEdit, FaTrash } from 'react-icons/fa';
import type { FileSystemItem } from '../../libs/interface/common.interface';
import { selectFolder, selectFile } from '../../libs/redux/feature/workspace/workspace.slice';

export const FolderView: React.FC = () => {

  const dispatch = useDispatch();
  const [updateWorkspace, { isLoading: isRenaming }] = useUpdateWorkspaceMutation();
  const [deleteWorkspace, { isLoading: isDeleting }] = useDeleteWorkspaceMutation();
  const { items, selectedFolderId } = useSelector((state: RootState) => state.workspace);
  const currentItems = Object.values(items).filter(item => item.parent === selectedFolderId);

  const [renameItemData, setRenameItemData] = useState<FileSystemItem | null>(null);

  // Sort folders first, then files, both alphabetically
  const sortedItems = [...currentItems].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === ITEM_TYPES.FOLDER ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === ITEM_TYPES.FOLDER) {
      dispatch(selectFolder(item._id));
    } else {
      dispatch(selectFile(item._id));
    }
  };

  const handleRename = async (name: string): Promise<void> => {
    if (!renameItemData) return;
    const response = await updateWorkspace({ workspace_id: renameItemData._id, name }).unwrap();
    successNotify(response.message);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isDeleting || !window.confirm('Are you sure you want to delete this item? Nested contents will also be deleted.')) return;
    try {
      const response = await deleteWorkspace(id).unwrap();
      successNotify(response.message);
    } catch (error: unknown) {
      const response = error as { data?: { message?: string } };
      errorNotify(response.data?.message ?? 'Unable to delete. Please try again.');
    }
  };

  if (sortedItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
        <FaFolder className="w-16 h-16 text-gray-200 mb-4" />
        <p>This folder is empty</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {sortedItems.map(item => (
            <div
              key={item._id}
              className="relative flex flex-col items-center justify-center p-4 rounded-lg hover:bg-purple-50 border border-transparent hover:border-purple-200 cursor-pointer transition-colors group select-none"
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              {/* Action Buttons (visible on hover) */}
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setRenameItemData(item); }}
                  className="p-1.5 bg-white shadow-sm rounded text-gray-500 hover:text-purple-600"
                  title="Rename"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, item._id)}
                  className="p-1.5 bg-white shadow-sm rounded text-gray-500 hover:text-red-600"
                  disabled={isDeleting}
                  title="Delete"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>

              {item.type === ITEM_TYPES.FOLDER ? (
                <FaFolder className="w-12 h-12 text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
              ) : (
                <FaFileAlt className="w-12 h-12 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-sm font-medium text-gray-700 text-center w-full truncate" title={item.type === ITEM_TYPES.FILE ? `${item.name}.txt` : item.name}>
                {item.type === ITEM_TYPES.FILE ? `${item.name}.txt` : item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ItemFormModal
        isOpen={!!renameItemData}
        onClose={() => setRenameItemData(null)}
        onSubmit={handleRename}
        isLoading={isRenaming}
        title={`Rename ${renameItemData?.type === ITEM_TYPES.FOLDER ? 'Folder' : 'File'}`}
        initialName={renameItemData?.name}
        parent={selectedFolderId}
        submitLabel="Save"
        itemType={renameItemData?.type || ITEM_TYPES.FOLDER}
      />
    </>
  );
};

