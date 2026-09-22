import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../libs/redux/store/store.redux';
import { selectFolder } from '../../libs/redux/feature/workspace/workspace.slice';
import { FolderTreeItem } from './FolderTreeItem';
import { cn } from '../../libs/helper/common.helper';

import { FaHome } from 'react-icons/fa';

export default function Sidebar() {

  const dispatch = useDispatch();
  const { items, selectedFolderId } = useSelector((state: RootState) => state.workspace);
  const rootItems = Object.values(items).filter(item => item.parentId === null);

  const handleRootClick = () => {
    dispatch(selectFolder(null));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Workspace</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div
          className={cn('flex items-center py-2 px-4 cursor-pointer hover:bg-purple-50', { 'bg-purple-100 text-purple-800 font-medium': selectedFolderId === null })}
          onClick={handleRootClick}
        >
          <FaHome className="w-5 h-5 mr-2 text-gray-500" />
          <span className="text-sm">Root Workspace</span>
        </div>

        <div className="mt-2">
          {rootItems.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-400 italic">Workspace is empty</div>
          ) : (
            rootItems.map(item => (
              <FolderTreeItem key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
