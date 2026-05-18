import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import CalendarDay from './CalendarDay';

interface CalendarProps {
  onDateSelect?: (date: string) => void;
  initialDate?: string;
}

export default function Calendar({ onDateSelect, initialDate }: CalendarProps) {
  const { selectedDate, setSelectedDate, getDayData } = useApp();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() + 1 };
  });

  // initialDate beim ersten Mount anwenden
  useEffect(() => {
    if (initialDate) {
      const date = new Date(initialDate);
      setCurrentMonth({ year: date.getFullYear(), month: date.getMonth() + 1 });
      setSelectedDate(initialDate);
    }
  }, []); // Only on mount

  // onDateSelect aufrufen, wenn sich selectedDate ändert
  useEffect(() => {
    onDateSelect?.(selectedDate);
  }, [selectedDate, onDateSelect]);

  // Sync currentMonth wenn selectedDate von außen geändert wird (z.B. durch initialDate)
  useEffect(() => {
    if (initialDate && selectedDate === initialDate) {
      const date = new Date(selectedDate);
      setCurrentMonth({ year: date.getFullYear(), month: date.getMonth() + 1 });
    }
  }, [selectedDate, initialDate]);

  const daysInMonth = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInPrevMonth = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Vorheriger Monat
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = daysInPrevMonth - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 2, day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        day,
        date: dateStr,
        isCurrentMonth: false,
      });
    }

    // Aktueller Monat
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        day,
        date: dateStr,
        isCurrentMonth: true,
      });
    }

    // Nächster Monat
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        day,
        date: dateStr,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

      const goToToday = () => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setCurrentMonth({ year: today.getFullYear(), month: today.getMonth() + 1 });
        setSelectedDate(todayStr);
      };

      const handleDayClick = (date: string) => {
        setSelectedDate(date);
        // onDateSelect wird automatisch im useEffect aufgerufen
      };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {currentMonth.month}.{currentMonth.year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Heute
          </button>
          <button
            onClick={goToPrevMonth}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            &lt;
          </button>
          <button
            onClick={goToNextMonth}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

{/* Calendar grid */}
       <div className="grid grid-cols-7 gap-1">
         {daysInMonth.map((dayInfo) => {
           const dayData = getDayData(dayInfo.date);
           return (
           <CalendarDay
             key={dayInfo.date}
             day={dayInfo.day}
             date={dayInfo.date}
             dayData={dayData.timeEntries.length > 0 || dayData.todos.length > 0 ? dayData : null}
             isCurrentMonth={dayInfo.isCurrentMonth}
             isSelected={selectedDate === dayInfo.date}
             onClick={() => handleDayClick(dayInfo.date)}
           />
           );
         })}
       </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500 rounded"></div>
          <span>Arbeitszeit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-orange-500 rounded"></div>
          <span>Todos</span>
        </div>
      </div>
    </div>
  );
}
