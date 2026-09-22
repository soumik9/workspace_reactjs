import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import type { RootState } from '../../libs/redux/store/store.redux';
import type { FileSystemItem } from '../../libs/interface/common.interface';
import { selectFolder } from '../../libs/redux/feature/workspace/workspace.slice';

export const Breadcrumbs: React.FC = () => {

  const dispatch = useDispatch();
  const { items, selectedFolderId, selectedFileId } = useSelector((state: RootState) => state.workspace);

  // Build breadcrumb path
  const buildPath = (): FileSystemItem[] => {

    const path: FileSystemItem[] = [];
    let currentId = selectedFolderId;

    //  trace the file's parent when a file is selected, to show the path to its parent folder
    if (selectedFileId && !selectedFolderId) {
      currentId = items[selectedFileId]?.parentId || null;
    }

    while (currentId && items[currentId]) {
      path.push(items[currentId]);
      currentId = items[currentId].parentId;
    }
    return path.reverse();
  };

  const path = buildPath();

  const handleCrumbClick = (id: string | null) => {
    dispatch(selectFolder(id));
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 px-6 py-3 border-b border-gray-200 bg-white">
      {/* Root Crumb */}
      <div
        className="flex items-center cursor-pointer hover:text-purple-600 transition-colors"
        onClick={() => handleCrumbClick(null)}
      >
        <FaHome className="w-4 h-4" />
        <span className="ml-1 font-medium">Workspace</span>
      </div>

      {/* Path Crumbs */}
      {path.map((item) => (
        <React.Fragment key={item.id}>
          <FaChevronRight className="w-3 h-3 text-gray-400" />
          <div
            className="flex items-center cursor-pointer hover:text-purple-600 transition-colors"
            onClick={() => handleCrumbClick(item.id)}
          >
            <span className={item.id === selectedFolderId ? 'font-semibold text-gray-800' : ''}>
              {item.name}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
