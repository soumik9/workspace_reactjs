import React from 'react';
import { Modal } from '../common/Modal';
import type { IWorkspaceSummaryResponse } from '../../libs/interface/workspace.interface';
import { errorNotify, successNotify } from '../../libs/helper/notify.helper';

interface SummaryModalProps {
  data?: IWorkspaceSummaryResponse;
  fileName: string;
  isLoading: boolean;
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ data, fileName, isLoading, errorMessage, onRetry, onClose }) => {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data?.summary ?? '');
      successNotify('Summary copied');
    } catch {
      errorNotify('Unable to copy. Please select and copy the text manually.');
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={`Summary: ${fileName}.txt`}>
      <p className="mb-4 text-xs text-gray-500">Saved text is sent to OpenAI. AI may miss details; check the original file.</p>
      {isLoading && <p role="status" className="text-sm text-purple-600">Generating your summary...</p>}
      {errorMessage && (
        <div role="alert" className="text-sm text-red-600">
          <p>{errorMessage}</p>
          <button type="button" onClick={onRetry} className="mt-3 font-medium underline">Try again</button>
        </div>
      )}
      {data && !isLoading && !errorMessage && (
        <>
          <div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{data.summary}</div>
          <button type="button" onClick={handleCopy} className="mt-4 rounded bg-purple-600 px-4 py-2 text-sm text-white">Copy summary</button>
        </>
      )}
    </Modal>
  );
};
