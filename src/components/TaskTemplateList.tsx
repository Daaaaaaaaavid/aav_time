import { useState } from 'react';
import { useDeleteTaskTemplate, useTaskTemplates } from '../api/taskTemplate';
import TaskTemplateForm from './TaskTemplate';

interface TaskTemplateListProps {
  onSelect?: (templateId: string) => void;
  showCreateButton?: boolean;
}

export default function TaskTemplateList({
  onSelect,
  showCreateButton = true,
}: TaskTemplateListProps) {
  const { data: taskTemplates = [], isLoading } = useTaskTemplates();
  const deleteTaskTemplate = useDeleteTaskTemplate();

  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <p>Lade Templates...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Task-Templates</h2>

        {showCreateButton && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Neu
          </button>
        )}
      </div>

      {taskTemplates.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Keine Templates vorhanden</p>
      ) : (
        <div className="space-y-2">
          {taskTemplates.map(template => (
            <div
              key={template.id}
              className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect?.(template.id)}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium">{template.title}</p>

                  {template.description && (
                    <p className="text-sm text-gray-600">{template.description}</p>
                  )}
                </div>

                <button
                  onClick={event => {
                    event.stopPropagation();
                    deleteTaskTemplate.mutate(template.id);
                  }}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <TaskTemplateForm onClose={() => setShowForm(false)} />}
    </div>
  );
}