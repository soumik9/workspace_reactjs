import React, { useState } from 'react';
import { cn } from '../../libs/helper/common.helper';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../libs/redux/store/store.redux';
import type { FileSystemItem } from '../../libs/interface/common.interface';
import { selectFolder, selectFile } from '../../libs/redux/feature/workspace/workspace.slice';
import { FaChevronRight, FaChevronDown, FaFolder, FaFolderOpen, FaFileAlt } from 'react-icons/fa';
import { ITEM_TYPES } from '../../libs/constant/common.constant';

interface FolderTreeItemProps {
  item: FileSystemItem;
  level?: number;
}

export const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ item, level = 0 }) => {

  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const { items, selectedFolderId, selectedFileId } = useSelector((state: RootState) => state.workspace);

  // Find children of this folder
  const children = Object.values(items).filter(child => child.parentId === item.id);
  const hasChildren = children.length > 0;

  const isSelected = item.type === ITEM_TYPES.FOLDER
    ? selectedFolderId === item.id
    : selectedFileId === item.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === ITEM_TYPES.FOLDER) {
      dispatch(selectFolder(item.id));
      if (!isExpanded) setIsExpanded(true);
    } else {
      dispatch(selectFile(item.id));
    }
  };

  return (
    <div className="select-none">
      <div
        className={cn('flex items-center py-1.5 px-2 cursor-pointer hover:bg-purple-50', { 'bg-purple-100 hover:bg-purple-200 text-purple-800': isSelected })}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Icon for folders */}
        <div className="w-5 flex items-center justify-center mr-1 text-gray-500" onClick={item.type === ITEM_TYPES.FOLDER ? handleToggle : undefined}>
          {item.type === ITEM_TYPES.FOLDER && (
            isExpanded ? <FaChevronDown className="w-3 h-3" /> : <FaChevronRight className="w-3 h-3" />
          )}
        </div>

        {/* File/Folder Icon */}
        <div className="w-5 flex items-center justify-center mr-2">
          {item.type === ITEM_TYPES.FOLDER ? (
            isExpanded ? <FaFolderOpen className="w-4 h-4 text-yellow-500" /> : <FaFolder className="w-4 h-4 text-yellow-500" />
          ) : (
            <FaFileAlt className="w-4 h-4 text-purple-500" />
          )}
        </div>

        {/* Item Name */}
        <span className="truncate text-sm" title={item.type === ITEM_TYPES.FILE ? `${item.name}.txt` : item.name}>
          {item.type === ITEM_TYPES.FILE ? `${item.name}.txt` : item.name}
        </span>
      </div>

      {/* Recursive Children Render */}
      {item.type === ITEM_TYPES.FOLDER && isExpanded && hasChildren && (
        <div>
          {children.map((child: FileSystemItem) => (
            <FolderTreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
