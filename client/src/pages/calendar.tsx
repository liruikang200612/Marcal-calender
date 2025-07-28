import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageProvider';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventListView from '@/components/calendar/EventListView';
import EventSidebar from '@/components/calendar/EventSidebar';
import EventDialog from '@/components/calendar/EventDialog';
import { useCalendar } from '@/hooks/use-calendar';
import { useEvents } from '@/hooks/use-events';
import type { Event } from '@/types/calendar';

interface RecommendedEventData {
  title: string;
  suggestedDate: string;
}

const eventTypeMapping: { [key: string]: number } = {
  holiday: 1,
  marketing: 2,
  custom: 3,
};

export default function CalendarPage() {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEventTypeId, setNewEventTypeId] = useState<number | null>(null);
  const [recommendedEventData, setRecommendedEventData] = useState<RecommendedEventData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number>(1);
  const { language, setLanguage } = useLanguage();
  const [currentView, setCurrentView] = useState<'month' | 'list'>('month');
  const [eventFilters, setEventFilters] = useState({
    holidays: true,
    marketing: true,
    custom: true,
  });

  const { currentDate, navigateMonth, goToToday } = useCalendar();
  const { events, holidays, isLoading } = useEvents(selectedRegion, currentDate);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active.data.current?.type === 'template') {
      const dateStr = over.id.toString().replace('calendar-cell-', '');
      const templateType = active.data.current.template;
      const eventTypeId = eventTypeMapping[templateType];

      setSelectedDate(dateStr);
      // Reset selectedEvent to null to ensure it's a new event
      setSelectedEvent(null); 
      // We can pass the template type to the dialog if needed, 
      // but for now, we'll just open the dialog for a new event on that date.
      // The form will be pre-filled based on the date and region.
      // To pre-fill the event type, we'll need to adjust EventDialog state management.
      
      setNewEventTypeId(eventTypeId);
      setIsEventDialogOpen(true);

      // A more robust solution would be to pass template data to the dialog
      // For example, by adding a new state for the template
      // const [newEventTypeId, setNewEventTypeId] = useState<number | null>(null);
      // setNewEventTypeId(eventTypeId);

    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleAcceptRecommendation = (data: RecommendedEventData) => {
    setRecommendedEventData(data);
    setSelectedDate(data.suggestedDate);
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleEventCreate = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen flex flex-col bg-gray-50">
      <CalendarHeader
        currentDate={currentDate}
        onNavigateMonth={navigateMonth}
        onGoToToday={goToToday}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="flex-1 flex">
        <main className="flex-1 p-6">
          {/* Filter Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Show:</span>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={eventFilters.holidays}
                    onChange={(e) => setEventFilters(prev => ({ ...prev, holidays: e.target.checked }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <span className="text-sm text-gray-600">Holidays</span>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={eventFilters.marketing}
                    onChange={(e) => setEventFilters(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <span className="text-sm text-gray-600">Marketing</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={eventFilters.custom}
                    onChange={(e) => setEventFilters(prev => ({ ...prev, custom: e.target.checked }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <span className="text-sm text-gray-600">Custom</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </label>
              </div>
            </div>
            
            <button 
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white border border-primary rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          {currentView === 'month' ? (
            <CalendarGrid
              currentDate={currentDate}
              events={events}
              holidays={holidays}
              eventFilters={eventFilters}
              onDateSelect={handleDateSelect}
              onEventSelect={handleEventSelect}
              isLoading={isLoading}
              language={language}
            />
          ) : (
            <EventListView 
              events={events} 
              holidays={holidays} 
              currentDate={currentDate}
              onEventSelect={handleEventSelect}
            />
          )}
        </main>

        <EventSidebar
          onEventCreate={handleEventCreate}
          selectedRegion={selectedRegion}
          language={language}
          onAcceptRecommendation={handleAcceptRecommendation}
        />
      </div>

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
          setNewEventTypeId(null); // Reset on close
          setRecommendedEventData(null);
        }}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
        newEventTypeId={newEventTypeId}
        recommendedEventData={recommendedEventData}
        selectedRegion={selectedRegion}
        language={language}
        currentDate={currentDate}
      />
    </div>
  </DndContext>
  );
}
