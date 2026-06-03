import { useState } from 'react';
import type { Todo } from '../types';
import { useApp } from '../context/AppContext';
import { useDayData } from '../hooks/useDayData';
import { useDeleteTodo, useUpdateTodo } from '../api/todos';
import TodoForm from './TodoForm';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500"
      />

      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
      >
        Löschen
      </button>
    </div>
  );
}

export default function TodosList() {
  const { selectedDate } = useApp();
  const { todos, isLoading } = useDayData(selectedDate);

  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const [showForm, setShowForm] = useState(false);

  const handleToggle = (todo: Todo) => {
    updateTodo.mutate({
      id: todo.id,
      updates: {
        completed: !todo.completed,
      },
    });
  };

  if (isLoading) {
    return <p>Lade Todos...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Todos</h2>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Neu
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Keine Todos für diesen Tag</p>
      ) : (
        <div className="space-y-2">
          {[...todos]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={id => deleteTodo.mutate(id)}
              />
            ))}
        </div>
      )}

      {showForm && (
        <TodoForm selectedDate={selectedDate} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}