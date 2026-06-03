import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTaskTemplates } from '../api/taskTemplate';
import type { TimeEntry } from '../types';

interface TimerProps {
  onTimerComplete?: (entry: TimeEntry) => void;
  showTemplates?: boolean;
  disabled?: boolean;
}

export default function Timer({
  onTimerComplete,
  showTemplates = true,
  disabled = false,
}: TimerProps) {
  const {
    timerFormattedTime,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    getActiveTimerEntry,
    updateActiveTimerEntry,
    selectedDate,
  } = useApp();

  const { data: taskTemplates = [] } = useTaskTemplates();

  const activeEntry = getActiveTimerEntry();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateObj = new Date(selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0);

  const isToday = today.getTime() === selectedDateObj.getTime();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    if (activeEntry) {
      setTitle(activeEntry.title);
      setDescription(activeEntry.description || '');
      setSelectedTemplate(activeEntry.taskTemplateId || '');
    }
  }, [activeEntry]);

  const handleStart = () => {
    if (!isToday || disabled) return;

    if (selectedTemplate) {
      const template = taskTemplates.find(t => t.id === selectedTemplate);

      startTimer({
        title: template?.title,
        description: template?.description,
        taskTemplateId: selectedTemplate,
      });

      return;
    }

    startTimer({
      title: title.trim() || 'Arbeitszeit',
      description: description.trim(),
    });
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

    const template = taskTemplates.find(t => t.id === newTemplateId);

    if (template) {
      setTitle(template.title);
      setDescription(template.description);

      if (activeEntry) {
        updateActiveTimerEntry({
          taskTemplateId: template.id,
          title: template.title,
          description: template.description,
        });
      }
    }
  };

  const isActive = !!activeEntry || isTimerRunning;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Timer</h2>

      {showTemplates && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Task Template optional</label>

          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            disabled={isTimerRunning}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Kein Template</option>

            {taskTemplates.map(tpl => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-4xl font-mono text-center my-6">
        {timerFormattedTime}
      </div>

      {!isToday && (
        <p className="text-sm text-red-600 text-center mb-4">
          Timer kann nur für den aktuellen Tag gestartet werden.
        </p>
      )}

      <div className="space-y-3 mb-6">
        <input
          value={title}
          onChange={handleTitleChange}
          placeholder="Titel"
          className="w-full p-2 border rounded-md"
        />

        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Beschreibung"
          rows={3}
          className="w-full p-2 border rounded-md resize-none"
        />
      </div>

      <div className="flex gap-3 justify-center">
        {!isTimerRunning && !activeEntry && (
          <button
            onClick={handleStart}
            disabled={!isToday || disabled}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
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