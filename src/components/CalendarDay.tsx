import type { DayData } from '../types';
import { useApp } from '../context/AppContext';

export default function CalendarDay({
  day,
  dayData,
  isCurrentMonth,
  isSelected,
  onClick,
}: {
  day: number;
  dayData: DayData | null;
  isCurrentMonth: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { selectedDate } = useApp();
  const isToday = selectedDate === `${new Date().toISOString().split('T')[0]}`;

  const totalMinutes = dayData?.timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) || 0;
  const hasTime = totalMinutes > 0;
  const hasTodos = dayData && dayData.todos.length > 0;

  return (
    <button
      onClick={onClick}
      className={`
        min-h-[80px] p-2 border text-left relative
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
        ${isSelected ? 'ring-2 ring-blue-500 z-10' : ''}
        hover:bg-blue-50 transition-colors
      `}
    >
      <span className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
        {day}
      </span>

      {/* Zeit-Indikator */}
      {hasTime && (
        <div className="mt-1">
          <div className="h-1 bg-green-500 rounded-full w-full max-w-[80%]"></div>
          <span className="text-xs text-gray-500">{totalMinutes} min</span>
        </div>
      )}

      {/* Todo-Indikator */}
      {hasTodos && (
        <div className="mt-1">
          <div className="h-1 bg-orange-500 rounded-full w-full max-w-[60%]"></div>
        </div>
      )}
    </button>
  );
}
