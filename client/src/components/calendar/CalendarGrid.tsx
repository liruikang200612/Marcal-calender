import { useDndContext, useDroppable } from '@dnd-kit/core';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, parseISO, isWithinInterval } from 'date-fns';
import { getLunarDate } from '@/lib/lunar';
import type { Event, Holiday } from '@/types/calendar';

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  holidays: Holiday[];
  eventFilters: {
    holidays: boolean;
    marketing: boolean;
    custom: boolean;
  };
  onDateSelect: (date: string) => void;
  onEventSelect: (event: Event) => void; // Add this line
  isLoading: boolean;
  language: 'zh' | 'en';
}

interface CalendarCellProps {
  date: Date;
  events: Event[];
  holidays: Holiday[];
  eventFilters: CalendarGridProps['eventFilters'];
  onDateSelect: (date: string) => void;
  onEventSelect: (event: Event) => void; // Add this line
  isCurrentMonth: boolean;
  language: 'zh' | 'en';
}

function CalendarCell({ 
  date, 
  events, 
  holidays, 
  eventFilters, 
  onDateSelect, 
  onEventSelect, // Add this line
  isCurrentMonth,
  language 
}: CalendarCellProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const { setNodeRef } = useDroppable({
    id: `calendar-cell-${dateStr}`,
  });

  const dayEvents = events.filter(event => {
    if (!event || !event.startDate) return false;
    try {
      const eventStart = parseISO(event.startDate);
      if (event.endDate && event.endDate !== event.startDate) {
        const eventEnd = parseISO(event.endDate);
        return isWithinInterval(date, { start: eventStart, end: eventEnd });
      }
      return isSameDay(eventStart, date);
    } catch (error) {
      console.warn(`Failed to parse date with parseISO: ${event.startDate}, falling back to new Date()`, error);
      try {
        const eventStart = new Date(event.startDate);
        if (event.endDate && event.endDate !== event.startDate) {
            const eventEnd = new Date(event.endDate);
            return isWithinInterval(date, { start: eventStart, end: eventEnd });
        }
        return isSameDay(eventStart, date);
      } catch (fallbackError) {
        console.error('Invalid date format for event (both parseISO and new Date failed):', event, fallbackError);
        return false;
      }
    }
  });
  
  const dayHolidays = holidays.filter(holiday => {
    if (!holiday || !holiday.date) return false;
    try {
      const holidayDate = parseISO(holiday.date);
      return isSameDay(holidayDate, date);
    } catch (error) {
      console.warn(`Failed to parse date with parseISO: ${holiday.date}, falling back to new Date()`, error);
      try {
        const holidayDate = new Date(holiday.date);
        return isSameDay(holidayDate, date);
      } catch (fallbackError) {
        console.error('Invalid date format for holiday (both parseISO and new Date failed):', holiday, fallbackError);
        return false;
      }
    }
  });

  const lunarDate = getLunarDate(dateStr);
  const isCurrentDay = isToday(date);

  const getEventTypeClass = (eventTypeId: number) => {
    switch (eventTypeId) {
      case 1: return 'bg-red-100 text-red-800'; // holiday
      case 2: return 'bg-blue-100 text-blue-800'; // marketing
      case 3: return 'bg-green-100 text-green-800'; // custom
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const shouldShowEvent = (eventTypeId: number) => {
    switch (eventTypeId) {
      case 1: return eventFilters.holidays;
      case 2: return eventFilters.marketing;
      case 3: return eventFilters.custom;
      default: return true;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] p-3 border-b border-r border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
        isCurrentDay ? 'bg-blue-50 border-blue-200' : ''
      } ${!isCurrentMonth ? 'text-gray-400' : ''}`}
      onClick={() => onDateSelect(dateStr)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
          {format(date, 'd')}
        </span>
        <span className="text-xs text-gray-500">
          {lunarDate}
        </span>
      </div>
      
      {/* Events */}
      <div className="space-y-1">
        {/* Holidays */}
        {eventFilters.holidays && dayHolidays.map((holiday) => (
          <div
            key={holiday.id}
            className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded truncate"
            draggable
          >
            {holiday.name}
          </div>
        ))}
        
        {/* Events */}
        {dayEvents
          .filter(event => shouldShowEvent(event.eventTypeId || 3))
          .map((event) => (
            <div
              key={event.id}
              className={`text-xs px-2 py-1 rounded truncate cursor-move ${getEventTypeClass(event.eventTypeId || 3)}`}
              draggable
              onClick={(e) => { e.stopPropagation(); onEventSelect(event); }} // Add this line
            >
              {event.title}
            </div>
          ))}
      </div>
    </div>
  );
}

export default function CalendarGrid({ 
  currentDate, 
  events, 
  holidays, 
  eventFilters, 
  onDateSelect, 
  onEventSelect, // Add this line
  isLoading,
  language 
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the first day of the calendar grid (might be from previous month)
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay());
  
  // Get the last day of the calendar grid (might be from next month)
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = language === 'zh' 
    ? [
        { en: 'Sunday', zh: '周日' },
        { en: 'Monday', zh: '周一' },
        { en: 'Tuesday', zh: '周二' },
        { en: 'Wednesday', zh: '周三' },
        { en: 'Thursday', zh: '周四' },
        { en: 'Friday', zh: '周五' },
        { en: 'Saturday', zh: '周六' },
      ]
    : [
        { en: 'Sunday', zh: '周日' },
        { en: 'Monday', zh: '周一' },
        { en: 'Tuesday', zh: '周二' },
        { en: 'Wednesday', zh: '周三' },
        { en: 'Thursday', zh: '周四' },
        { en: 'Friday', zh: '周五' },
        { en: 'Saturday', zh: '周六' },
      ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {weekDays.map((day, index) => (
          <div key={index} className={`p-4 text-center ${index > 0 ? 'border-l border-gray-200' : ''}`}>
            <span className="text-sm font-medium text-gray-700">
              {language === 'zh' ? day.en : day.en}
            </span>
            <span className="text-xs text-gray-500 block mt-1">
              {day.zh}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => (
          <CalendarCell
            key={day.toString()}
            date={day}
            events={events}
            holidays={holidays}
            eventFilters={eventFilters}
            onDateSelect={onDateSelect}
            onEventSelect={onEventSelect} // Add this line
            isCurrentMonth={isSameMonth(day, currentDate)}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}
