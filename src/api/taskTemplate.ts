import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TaskTemplate } from '../types';
import { apiRequest } from './client';

export const taskTemplatesKeys = {
  all: ['taskTemplates'] as const,
};

export function getTaskTemplates() {
  return apiRequest<TaskTemplate[]>('/api/task-templates');
}

export function createTaskTemplate(template: Omit<TaskTemplate, 'id'>) {
  return apiRequest<TaskTemplate>('/api/task-templates', {
    method: 'POST',
    body: JSON.stringify(template),
  });
}

export function updateTaskTemplate({
  id,
  updates,
}: {
  id: string;
  updates: Partial<TaskTemplate>;
}) {
  return apiRequest<TaskTemplate>(`/api/task-templates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function deleteTaskTemplate(id: string) {
  return apiRequest<{ success: boolean }>(`/api/task-templates/${id}`, {
    method: 'DELETE',
  });
}

export function useTaskTemplates() {
  return useQuery({
    queryKey: taskTemplatesKeys.all,
    queryFn: getTaskTemplates,
  });
}

export function useCreateTaskTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskTemplatesKeys.all });
    },
  });
}

export function useUpdateTaskTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskTemplatesKeys.all });
    },
  });
}

export function useDeleteTaskTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskTemplatesKeys.all });
    },
  });
}