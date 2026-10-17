import React, { useState } from 'react';
import { FileEditor } from './FileEditor';
import { FolderView } from './FolderView';
import { Breadcrumbs } from './Breadcrumbs';
import { useSelector } from 'react-redux';
import { ItemFormModal } from '../common/ItemFormModal';
import type { RootState } from '../../libs/redux/store/store.redux';
import type { ItemType } from '../../libs/interface/common.interface';
import { useCreateWorkspaceMutation } from '../../libs/redux/feature/workspace/workspace.api';
import { successNotify } from '../../libs/helper/notify.helper';
import { TOOLBAR_ACTIONS, ITEM_TYPES } from '../../libs/constant/common.constant';

export const MainPanel: React.FC = () => {
  const [createWorkspace, { isLoading: isCreating }] = useCreateWorkspaceMutation();
  const { selectedFileId, selectedFolderId } = useSelector((state: RootState) => state.workspace);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createType, setCreateType] = useState<ItemType>(ITEM_TYPES.FOLDER);

  const handleOpenCreate = (type: ItemType) => {
    setCreateType(type);
    setIsModalOpen(true);
  };

  const handleCreate = async (name: string): Promise<void> => {
    const response = await createWorkspace({
      name,
      type: createType,
      parent: selectedFolderId,
      ...(createType === ITEM_TYPES.FILE ? { content: '' } : {}),
    }).unwrap();
    successNotify(response.message);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <Breadcrumbs />

      {/* Toolbar Area */}
      <div className="px-6 py-2 border-b border-gray-100 flex items-center space-x-3 bg-gray-50/50">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.type}
            onClick={() => handleOpenCreate(action.type)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
          >
            <action.icon className="w-4 h-4" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedFileId ? (
          <FileEditor key={selectedFileId} />
        ) : (
          <FolderView />
        )}
      </div>

      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        title={`Create New ${createType === ITEM_TYPES.FOLDER ? 'Folder' : 'File'}`}
        parent={selectedFolderId}
        submitLabel="Create"
        itemType={createType}
        isLoading={isCreating}
      />
    </div>
  );
};
