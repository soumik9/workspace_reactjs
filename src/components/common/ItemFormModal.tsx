import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useSelector } from 'react-redux';
import type { RootState } from '../../libs/redux/store/store.redux';
import type { ItemType } from '../../libs/interface/common.interface';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
  isLoading?: boolean;
  title: string;
  initialName?: string;
  parent: string | null;
  submitLabel?: string;
  itemType: ItemType;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen, onClose, onSubmit, title, initialName = '', parent, submitLabel = 'Save', itemType, isLoading = false
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isBusy = isLoading || isSubmitting;
  const { items } = useSelector((state: RootState) => state.workspace);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError('');
    }
  }, [isOpen, initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setError('');
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name cannot be empty.');
      return;
    }

    // Check duplicates
    const isDuplicate = Object.values(items).some(
      item => item.parent === parent && item.type === itemType && item.name.toLowerCase() === trimmedName.toLowerCase() && item.name !== initialName
    );

    if (isDuplicate) {
      setError(`A ${itemType} with this name already exists in this folder.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedName);
      onClose();
    } catch (error: unknown) {
      const response = error as { data?: { message?: string } };
      setError(response.data?.message ?? 'Unable to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { if (!isBusy) onClose(); }} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            disabled={isBusy}
            id="itemName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter name..."
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            disabled={isBusy}
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            disabled={isBusy}
            aria-busy={isBusy}
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isBusy ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
};
