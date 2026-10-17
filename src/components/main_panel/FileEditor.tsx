import { SummaryModal } from './SummaryModal';
import { useUpdateWorkspaceMutation, useSummarizeWorkspaceMutation } from '../../libs/redux/feature/workspace/workspace.api';
import { errorNotify, successNotify } from '../../libs/helper/notify.helper';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaFileAlt, FaSave, FaTimes, FaMagic } from 'react-icons/fa';
import type { RootState } from '../../libs/redux/store/store.redux';
import { selectFile } from '../../libs/redux/feature/workspace/workspace.slice';

export const FileEditor: React.FC = () => {

  const dispatch = useDispatch();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summarize, { data: summaryData, isLoading: isSummarizing, error: summaryError, reset: resetSummary }] = useSummarizeWorkspaceMutation();
  const [updateWorkspace, { isLoading: isSaving }] = useUpdateWorkspaceMutation();
  const { items, selectedFileId } = useSelector((state: RootState) => state.workspace);

  const file = selectedFileId ? items[selectedFileId] : null;
  const [localContent, setLocalContent] = useState(file?.content ?? '');
  const isAnyChanged = file ? localContent !== (file.content ?? '') : false;

  const summaryHint = isAnyChanged ? 'Save your changes before summarizing.'
    : !localContent.trim() ? 'Add and save some text to generate a summary.'
    : localContent.length > 30000 ? 'Summaries support files up to 30,000 characters.'
    : '';

  const handleSummarize = () => {
    if (!file || isAnyChanged || isSaving || isSummarizing || Boolean(summaryHint)) return;
    resetSummary();
    setIsSummaryOpen(true);
    summarize(file._id);
  };
  const summaryErrorMessage = summaryError
    ? ('data' in summaryError ? (summaryError.data as { message?: string })?.message : undefined) ?? 'Unable to summarize. Please try again.'
    : '';

  const handleSave = async () => {
    if (!file || !isAnyChanged || isSaving) return;
    try {
      const response = await updateWorkspace({ workspace_id: file._id, content: localContent }).unwrap();
      successNotify(response.message);
    } catch (error: unknown) {
      const response = error as { data?: { message?: string } };
      errorNotify(response.data?.message ?? 'Unable to save. Please try again.');
    }
  };

  const handleClose = () => {
    if (isAnyChanged) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close without saving?');
      if (!confirmClose) return;
    }
    dispatch(selectFile(null));
  };

  if (!file)
    return null;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <div className="flex flex-wrap gap-3 items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaFileAlt className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-sm">{file.name}.txt {isAnyChanged && '*'}</span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <button
            type="button"
            onClick={handleSummarize}
            disabled={Boolean(summaryHint) || isSummarizing || isSaving}
            aria-busy={isSummarizing}
            aria-describedby={summaryHint ? 'summary-hint' : undefined}
            title={summaryHint || 'Summarize saved text'}
            className="flex items-center space-x-2 rounded bg-purple-100 px-3 py-1.5 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMagic className="h-3 w-3" />
            <span>{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!isAnyChanged || isSaving}
            aria-busy={isSaving}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded transition-colors ${isAnyChanged
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <FaSave className="w-3 h-3" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
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

      {summaryHint && <p id="summary-hint" className="border-b border-gray-100 px-6 py-2 text-xs text-gray-500">{summaryHint}</p>}

      {isSummaryOpen && (
        <SummaryModal
          fileName={file.name}
          data={summaryData?.data}
          isLoading={isSummarizing}
          errorMessage={summaryErrorMessage}
          onRetry={handleSummarize}
          onClose={() => setIsSummaryOpen(false)}
        />
      )}

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
