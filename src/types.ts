// Datentypen für das Zeiterfassungssystem

export interface TimeEntry {
  id: string;
  date: string; // ISO-Datumsstring (YYYY-MM-DD)
  startTime: string; // HH:MM
  endTime?: string; // HH:MM, optional wenn noch laufend
  duration?: number; // in Minuten
  title: string;
  description: string;
  taskTemplateId?: string; // Referenz zu einem Template
}

export interface Todo {
  id: string;
  date: string; // ISO-Datumsstring (YYYY-MM-DD)
  title: string;
  completed: boolean;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  color?: string; // optional: Farbe für Kalenderanzeige
}

export interface DayData {
  date: string;
  timeEntries: TimeEntry[];
  todos: Todo[];
}
