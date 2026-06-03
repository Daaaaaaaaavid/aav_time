import { useTimeEntries } from '../api/timeEntries';
import { useTodos } from '../api/todos';

export function useDayData(date: string) {
  const timeEntriesQuery = useTimeEntries();
  const todosQuery = useTodos();

  const timeEntries = timeEntriesQuery.data ?? [];
  const todos = todosQuery.data ?? [];

  return {
    date,
    timeEntries: timeEntries.filter(entry => entry.date === date),
    todos: todos.filter(todo => todo.date === date),
    isLoading: timeEntriesQuery.isLoading || todosQuery.isLoading,
    isError: timeEntriesQuery.isError || todosQuery.isError,
    error: timeEntriesQuery.error || todosQuery.error,
  };
}