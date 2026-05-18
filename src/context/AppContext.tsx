import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { TimeEntry, Todo, TaskTemplate, DayData } from '../types';
import { useTimer } from '../hooks/useTimer';

interface AppContextType {
  timeEntries: TimeEntry[];
  todos: Todo[];
  taskTemplates: TaskTemplate[];
  selectedDate: string;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addTaskTemplate: (template: Omit<TaskTemplate, 'id'>) => void;
  deleteTaskTemplate: (id: string) => void;
  setSelectedDate: (date: string) => void;
  getDayData: (date: string) => DayData;
  getActiveTimerEntry: () => TimeEntry | undefined;
  updateActiveTimerEntry: (updates: Partial<TimeEntry>) => void;
  startTimer: (templateId?: string, customTitle?: string, customDesc?: string) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  timerFormattedTime: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TIME_ENTRIES: 'aav_time_entries',
  TODOS: 'aav_todos',
  TASK_TEMPLATES: 'aav_task_templates',
  SELECTED_DATE: 'aav_selected_date',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return saved ? JSON.parse(saved) : [];
  });
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
    return saved ? JSON.parse(saved) : [];
  });
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASK_TEMPLATES);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE);
    if (saved) return saved;
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [activeTimerEntry, setActiveTimerEntry] = useState<TimeEntry | undefined>(undefined);
  const timer = useTimer();

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
  }, [timeEntries]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASK_TEMPLATES, JSON.stringify(taskTemplates));
  }, [taskTemplates]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, selectedDate);
  }, [selectedDate]);

  // Sync timer state with active entry
  useEffect(() => {
    if (activeTimerEntry && !timer.isRunning) {
      // Timer stopped, save entry
      const endTime = new Date();
      const start = new Date(`${activeTimerEntry.date}T${activeTimerEntry.startTime}`);
      const durationMinutes = Math.round((endTime.getTime() - start.getTime()) / 1000 / 60);

      const updatedEntry: TimeEntry = {
        ...activeTimerEntry,
        endTime: endTime.toTimeString().slice(0, 5),
        duration: durationMinutes,
      };

      setTimeEntries(prev => [...prev, updatedEntry]);
      setActiveTimerEntry(undefined);
      timer.stop();
    }
  }, [timer.isRunning, activeTimerEntry]);

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setTimeEntries(prev => [...prev, newEntry]);
  };

  const updateTimeEntry = (id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries(prev => prev.filter(e => e.id !== id));
  };

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const addTaskTemplate = (template: Omit<TaskTemplate, 'id'>) => {
    const newTemplate: TaskTemplate = {
      ...template,
      id: Date.now().toString(),
    };
    setTaskTemplates(prev => [...prev, newTemplate]);
  };

  const deleteTaskTemplate = (id: string) => {
    setTaskTemplates(prev => prev.filter(t => t.id !== id));
  };

  const getDayData = (date: string): DayData => {
    return {
      date,
      timeEntries: timeEntries.filter(e => e.date === date),
      todos: todos.filter(t => t.date === date),
    };
  };

  const updateActiveTimerEntry = (updates: Partial<TimeEntry>) => {
    if (!activeTimerEntry) return;
    setActiveTimerEntry(prev => prev ? { ...prev, ...updates } : undefined);
  };

  const startTimer = (templateId?: string, customTitle?: string, customDesc?: string) => {
    if (activeTimerEntry) return; // Already running

    const now = new Date();
    const date = selectedDate;
    const startTime = now.toTimeString().slice(0, 5);

    let title = 'Arbeitszeit';
    let description = '';

    if (templateId) {
      const template = taskTemplates.find(t => t.id === templateId);
      if (template) {
        title = template.title;
        description = template.description;
      }
    } else if (customTitle) {
      title = customTitle;
      description = customDesc || '';
    }

    const newEntry: TimeEntry = {
      id: '',
      date,
      startTime,
      title,
      description,
      taskTemplateId: templateId,
    };

    setActiveTimerEntry(newEntry);
    timer.start();
  };

  const stopTimer = () => {
    if (activeTimerEntry) {
      timer.stop();
    }
  };

  const resetTimer = () => {
    setActiveTimerEntry(undefined);
    timer.reset();
  };

  return (
    <AppContext.Provider
      value={{
        timeEntries,
        todos,
        taskTemplates,
        selectedDate,
        addTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
        addTodo,
        toggleTodo,
        deleteTodo,
        addTaskTemplate,
        deleteTaskTemplate,
        setSelectedDate,
        getDayData,
        getActiveTimerEntry: () => activeTimerEntry,
        updateActiveTimerEntry,
        startTimer,
        stopTimer,
        resetTimer,
        timerSeconds: timer.seconds,
        isTimerRunning: timer.isRunning,
        timerFormattedTime: timer.formattedTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
