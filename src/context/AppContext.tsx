import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { TimeEntry } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useCreateTimeEntry } from '../api/timeEntries';

interface StartTimerInput {
  title?: string;
  description?: string;
  taskTemplateId?: string;
}

interface AppContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  getActiveTimerEntry: () => TimeEntry | undefined;
  updateActiveTimerEntry: (updates: Partial<TimeEntry>) => void;

  startTimer: (input?: StartTimerInput) => void;
  stopTimer: () => void;
  resetTimer: () => void;

  timerSeconds: number;
  isTimerRunning: boolean;
  timerFormattedTime: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SELECTED_DATE: 'aav_selected_date',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE);

    if (saved) return saved;

    const today = new Date();

    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate(),
    ).padStart(2, '0')}`;
  });

  const [activeTimerEntry, setActiveTimerEntry] = useState<TimeEntry | undefined>(undefined);

  const timer = useTimer();
  const createTimeEntry = useCreateTimeEntry();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, selectedDate);
  }, [selectedDate]);

  const updateActiveTimerEntry = (updates: Partial<TimeEntry>) => {
    setActiveTimerEntry(prev => (prev ? { ...prev, ...updates } : undefined));
  };

  const startTimer = (input?: StartTimerInput) => {
    if (activeTimerEntry) return;

    const now = new Date();

    const newEntry: TimeEntry = {
      id: '',
      date: selectedDate,
      startTime: now.toTimeString().slice(0, 5),
      title: input?.title || 'Arbeitszeit',
      description: input?.description || '',
      taskTemplateId: input?.taskTemplateId,
    };

    setActiveTimerEntry(newEntry);
    timer.start();
  };

  const stopTimer = () => {
    if (!activeTimerEntry) return;

    const endTime = new Date();
    const start = new Date(`${activeTimerEntry.date}T${activeTimerEntry.startTime}`);

    const durationMinutes = Math.round(
      (endTime.getTime() - start.getTime()) / 1000 / 60,
    );

    createTimeEntry.mutate({
      date: activeTimerEntry.date,
      startTime: activeTimerEntry.startTime,
      endTime: endTime.toTimeString().slice(0, 5),
      duration: durationMinutes,
      title: activeTimerEntry.title,
      description: activeTimerEntry.description,
      taskTemplateId: activeTimerEntry.taskTemplateId,
    });

    setActiveTimerEntry(undefined);
    timer.stop();
  };

  const resetTimer = () => {
    setActiveTimerEntry(undefined);
    timer.reset();
  };

  return (
    <AppContext.Provider
      value={{
        selectedDate,
        setSelectedDate,

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