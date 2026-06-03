import { useState } from 'react';
import { useCreateTodo } from '../api/todos';

export default function TodoForm({
  selectedDate,
  onClose,
}: {
  selectedDate: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const createTodo = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    createTodo.mutate(
      {
        date: selectedDate,
        title: title.trim(),
        completed: false,
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
        <h3 className="text-lg font-semibold mb-4">Neue Aufgabe</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Aufgabe beschreiben..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}>
              Abbrechen
            </button>

            <button
              type="submit"
              disabled={createTodo.isPending}
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