import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaFileAlt, FaSave, FaTimes } from 'react-icons/fa';
import type { RootState } from '../../libs/redux/store/store.redux';
import { updateFileContent, selectFile } from '../../libs/redux/feature/workspace/workspace.slice';

export const FileEditor: React.FC = () => {

  const dispatch = useDispatch();
  const { items, selectedFileId } = useSelector((state: RootState) => state.workspace);

  const file = selectedFileId ? items[selectedFileId] : null;
  const [localContent, setLocalContent] = useState('');

  // set content of the file
  useEffect(() => {
    if (file) {
      setLocalContent(file.content || '');
    }
  }, [selectedFileId]);

  const isAnyChanged = file ? localContent !== (file.content || '') : false;

  const handleSave = () => {
    if (file) {
      dispatch(updateFileContent({ id: file.id, content: localContent }));
    }
  };

  const handleClose = () => {
    if (isAnyChanged) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close without saving?');
      if (!confirmClose) return;
    }
    dispatch(selectFile(null));
  };

  if (!file) return null;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaFileAlt className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-sm">{file.name}.txt {isAnyChanged && '*'}</span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <button
            onClick={handleSave}
            disabled={!isAnyChanged}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded transition-colors ${isAnyChanged
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <FaSave className="w-3 h-3" />
            <span>Save</span>
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-500 transition-colors"
            title="Close File"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-6 bg-gray-50/50">
        <textarea
          autoFocus
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          className="w-full h-full p-4 resize-none focus:outline-none focus:ring-1 focus:ring-purple-300 border border-gray-200 rounded-lg shadow-sm font-mono text-sm text-gray-800 leading-relaxed bg-white"
          placeholder="Start typing..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};
