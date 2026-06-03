import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useDayData } from '../hooks/useDayData';
import { useDeleteTimeEntry, useUpdateTimeEntry } from '../api/timeEntries';
import TimeEntryItem from './TimeEntryItem';

export default function TimeEntriesList() {
  const { selectedDate } = useApp();
  const { timeEntries, isLoading } = useDayData(selectedDate);

  const updateTimeEntry = useUpdateTimeEntry();
  const deleteTimeEntry = useDeleteTimeEntry();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const entries = [...timeEntries].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleStartEdit = (entry: typeof entries[0]) => {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditDescription(entry.description || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;

    updateTimeEntry.mutate(
      {
        id,
        updates: {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditTitle('');
          setEditDescription('');
        },
      },
    );
  };

  if (isLoading) {
    return <p>Lade Arbeitsblöcke...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Arbeitsblöcke</h2>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Keine Arbeitsblöcke für diesen Tag</p>
      ) : (
        <div className="space-y-3">
          {entries.map(entry =>
            editingId === entry.id ? (
              <div key={entry.id} className="p-4 border-2 border-blue-500 rounded-md">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />

                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(entry.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Speichern
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <TimeEntryItem
                key={entry.id}
                entry={entry}
                onDelete={id => deleteTimeEntry.mutate(id)}
                onEdit={handleStartEdit}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}