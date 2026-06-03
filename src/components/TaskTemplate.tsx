import { useState } from 'react';
import { useCreateTaskTemplate } from '../api/taskTemplate';

export default function TaskTemplateForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createTaskTemplate = useCreateTaskTemplate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    createTaskTemplate.mutate(
      {
        title: title.trim(),
        description: description.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Neues Task-Template</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titel"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Beschreibung"
            rows={3}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}>
              Abbrechen
            </button>

            <button
              type="submit"
              disabled={createTaskTemplate.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}