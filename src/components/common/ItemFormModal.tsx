import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useSelector } from 'react-redux';
import type { RootState } from '../../libs/redux/store/store.redux';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
  initialName?: string;
  parentId: string | null;
  submitLabel?: string;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen, onClose, onSubmit, title, initialName = '', parentId, submitLabel = 'Save'
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const { items } = useSelector((state: RootState) => state.workspace);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError('');
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name cannot be empty.');
      return;
    }

    // Check duplicates
    const isDuplicate = Object.values(items).some(
      item => item.parentId === parentId && item.name.toLowerCase() === trimmedName.toLowerCase() && item.name !== initialName
    );

    if (isDuplicate) {
      setError('An item with this name already exists in this folder.');
      return;
    }

    onSubmit(trimmedName);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
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
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
};
