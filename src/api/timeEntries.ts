import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TimeEntry } from '../types';
import { apiRequest } from './client';

export const timeEntriesKeys = {
  all: ['timeEntries'] as const,
};

export function getTimeEntries() {
  return apiRequest<TimeEntry[]>('/api/time-entries');
}

export function createTimeEntry(entry: Omit<TimeEntry, 'id'>) {
  return apiRequest<TimeEntry>('/api/time-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export function updateTimeEntry({
  id,
  updates,
}: {
  id: string;
  updates: Partial<TimeEntry>;
}) {
  return apiRequest<TimeEntry>(`/api/time-entries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function deleteTimeEntry(id: string) {
  return apiRequest<{ success: boolean }>(`/api/time-entries/${id}`, {
    method: 'DELETE',
  });
}

export function useTimeEntries() {
  return useQuery({
    queryKey: timeEntriesKeys.all,
    queryFn: getTimeEntries,
  });
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
}