import type { Event, Holiday } from '@shared/schema';
import { format, getMonth, getYear } from 'date-fns';

interface EventListViewProps {
  events: Event[];
  holidays: Holiday[];
  currentDate: Date;
  onEventSelect: (event: Event) => void;
}

export default function EventListView({ events, holidays, currentDate, onEventSelect }: EventListViewProps) {
  const transformedHolidays: Event[] = holidays.map(holiday => ({
    id: holiday.id,
    title: holiday.name,
    description: holiday.description,
    startDate: holiday.date,
    endDate: holiday.date,
    regionId: holiday.regionId,
    eventTypeId: null,
    isHoliday: true,
    createdAt: new Date(holiday.createdAt),
    updatedAt: new Date(holiday.createdAt),
  }));

  const allEvents = [...events, ...transformedHolidays]
    .filter(event => {
        const eventDate = new Date(event.startDate);
        return getYear(eventDate) === getYear(currentDate) && getMonth(eventDate) === getMonth(currentDate);
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {allEvents.map(event => (
          <li key={`${event.id}-${event.isHoliday}`} onClick={() => onEventSelect(event)} className="p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${event.isHoliday ? 'bg-red-500' : 'bg-green-500'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                <p className="text-sm text-gray-500">
                  {event.endDate && event.endDate !== event.startDate
                    ? `${format(new Date(event.startDate), 'yyyy-MM-dd')} - ${format(new Date(event.endDate), 'yyyy-MM-dd')}`
                    : format(new Date(event.startDate), 'yyyy-MM-dd')}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}