import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { TimeEntry } from '../types';

interface TimerProps {
  onTimerComplete?: (entry: TimeEntry) => void;
  showTemplates?: boolean;
  disabled?: boolean;
}

export default function Timer({ onTimerComplete, showTemplates = true, disabled = false }: TimerProps) {
  const {
    timerFormattedTime,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    getActiveTimerEntry,
    taskTemplates,
    updateActiveTimerEntry,
  } = useApp();

  const activeEntry = getActiveTimerEntry();

  // Lokaler State für Formularfelder (wird beim Start bzw. bei activeEntry gesetzt)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Sync local state mit activeEntry, wenn sich dieser ändert
  useEffect(() => {
    if (activeEntry) {
      setTitle(activeEntry.title);
      setDescription(activeEntry.description || '');
      setSelectedTemplate(activeEntry.taskTemplateId || '');
    }
  }, [activeEntry]);

  const handleStart = () => {
    if (selectedTemplate) {
      startTimer(selectedTemplate);
      const template = taskTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        setTitle(template.title);
        setDescription(template.description);
      }
    } else if (title.trim()) {
      startTimer(undefined, title.trim(), description.trim());
    } else {
      startTimer();
    }
  };

  const handleStop = () => {
    stopTimer();
    if (activeEntry && onTimerComplete) {
      onTimerComplete(activeEntry);
    }
  };

  const handleReset = () => {
    resetTimer();
    setTitle('');
    setDescription('');
    setSelectedTemplate('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (activeEntry) {
      updateActiveTimerEntry({ title: newTitle });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value;
    setDescription(newDesc);
    if (activeEntry) {
      updateActiveTimerEntry({ description: newDesc });
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplateId = e.target.value;
    setSelectedTemplate(newTemplateId);
    if (activeEntry) {
      const template = taskTemplates.find(t => t.id === newTemplateId);
      if (template) {
        setTitle(template.title);
        setDescription(template.description);
        updateActiveTimerEntry({
          taskTemplateId: newTemplateId || undefined,
          title: template.title,
          description: template.description,
        });
      } else {
        setTitle('');
        setDescription('');
        updateActiveTimerEntry({
          taskTemplateId: undefined,
          title: '',
          description: '',
        });
      }
    }
  };

  const isActive = !!activeEntry || isTimerRunning;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Timer</h2>

      {/* Template Selection - immer sichtbar */}
      {showTemplates && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Task Template (optional)</label>
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            disabled={disabled || isActive}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">Kein Template</option>
            {taskTemplates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Time Display */}
      <div className="text-6xl font-mono text-center my-8 text-gray-800">
        {timerFormattedTime}
      </div>

      {/* Title & Description Inputs - immer sichtbar */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Titel</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Arbeitszeit"
            disabled={disabled}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Beschreibung</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Beschreibung..."
            rows={3}
            disabled={disabled}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center">
        {!isTimerRunning && !activeEntry && (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            Start
          </button>
        )}
        {isTimerRunning && (
          <button
            onClick={handleStop}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            Stop
          </button>
        )}
        {isActive && (
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium"
          >
            Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
