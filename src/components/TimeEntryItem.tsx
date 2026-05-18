import type { TimeEntry } from '../types';
import { useApp } from '../context/AppContext';

interface TimeEntryItemProps {
  entry: TimeEntry;
  onDelete: (id: string) => void;
  onEdit?: (entry: TimeEntry) => void;
}

export default function TimeEntryItem({ entry, onDelete, onEdit }: TimeEntryItemProps) {
  const { taskTemplates } = useApp();

  const template = entry.taskTemplateId
    ? taskTemplates.find(t => t.id === entry.taskTemplateId)
    : null;

  const durationText = entry.duration
    ? `${entry.duration} min`
    : 'Läuft...';

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium truncate">{entry.title}</p>
          {template && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
              {template.title}
            </span>
          )}
        </div>
        {entry.description && (
          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{entry.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{entry.startTime}</span>
          {entry.endTime && <span>- {entry.endTime}</span>}
          <span className="font-medium text-green-600">{durationText}</span>
        </div>
      </div>

      <div className="flex gap-1">
        {onEdit && (
          <button
            onClick={() => onEdit(entry)}
            className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
          >
            Bearbeiten
          </button>
        )}
        <button
          onClick={() => onDelete(entry.id)}
          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}
