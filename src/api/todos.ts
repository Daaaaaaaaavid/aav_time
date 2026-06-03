import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../types';
import { apiRequest } from './client';

export const todosKeys = {
  all: ['todos'] as const,
};

export function getTodos() {
  return apiRequest<Todo[]>('/api/todos');
}

export function createTodo(todo: Omit<Todo, 'id'>) {
  return apiRequest<Todo>('/api/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });
}

export function updateTodo({
  id,
  updates,
}: {
  id: string;
  updates: Partial<Todo>;
}) {
  return apiRequest<Todo>(`/api/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function deleteTodo(id: string) {
  return apiRequest<{ success: boolean }>(`/api/todos/${id}`, {
    method: 'DELETE',
  });
}

export function useTodos() {
  return useQuery({
    queryKey: todosKeys.all,
    queryFn: getTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all });
    },
  });
}