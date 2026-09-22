import { FolderTreeItem } from './FolderTreeItem';
import { cn } from '../../libs/helper/common.helper';
import { useSelector, useDispatch } from 'react-redux';
import { ITEM_TYPES } from '../../libs/constant/common.constant';
import type { RootState } from '../../libs/redux/store/store.redux';
import { FaHome, FaSearch, FaFileAlt, FaFolder } from 'react-icons/fa';
import { selectFolder, selectFile, setSearchQuery } from '../../libs/redux/feature/workspace/workspace.slice';

export default function Sidebar() {

  const dispatch = useDispatch();
  const { items, selectedFolderId, searchQuery } = useSelector((state: RootState) => state.workspace);
  const rootItems = Object.values(items).filter(item => item.parentId === null);

  const searchResults = Object.values(items).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRootClick = () => {
    dispatch(selectFolder(null));
  };

  const handleSearchResultClick = (item: any) => {
    if (item.type === ITEM_TYPES.FOLDER) {
      dispatch(selectFolder(item.id));
    } else {
      dispatch(selectFile(item.id));
      dispatch(selectFolder(item.parentId));
    }
    dispatch(setSearchQuery(''));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex flex-col space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Soumik Workspace</h2>

        {/* Search Input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search workspace..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {searchQuery.trim() ? (
          /* Search Results */
          <div className="px-2">
            <h3 className="px-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Search Results</h3>
            {searchResults.length === 0 ? (
              <p className="px-2 text-sm text-gray-400">No results found.</p>
            ) : (
              searchResults.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSearchResultClick(item)}
                  className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-purple-100 rounded text-sm text-gray-700"
                >
                  <div className="w-5 flex justify-center mr-1">
                    {item.type === ITEM_TYPES.FOLDER ? (
                      <FaFolder className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <FaFileAlt className="w-4 h-4 text-purple-500" />
                    )}
                  </div>
                  <span className="truncate" title={item.name}>
                    {item.type === ITEM_TYPES.FILE ? `${item.name}.txt` : item.name}
                  </span>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Normal Tree */
          <>
            <div
              className={cn('flex items-center py-2 px-4 cursor-pointer hover:bg-purple-50', { 'bg-purple-100 text-purple-800 font-medium': selectedFolderId === null })}
              onClick={handleRootClick}
            >
              <FaHome className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-sm">Root</span>
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
          </>
        )}
      </div>
    </div>
  );
}
