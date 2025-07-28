import { DragEndEvent } from '@dnd-kit/core';

export interface DragData {
  type: 'event' | 'template';
  eventId?: number;
  template?: string;
  date?: string;
}

export function handleCalendarDrop(event: DragEndEvent) {
  const { active, over } = event;
  
  if (!over) return;
  
  const dragData = active.data.current as DragData;
  const dropData = over.data.current;
  
  // Handle template drop onto calendar cell
  if (dragData.type === 'template' && over.id.toString().startsWith('calendar-cell-')) {
    const targetDate = over.id.toString().replace('calendar-cell-', '');
    
    // Return data for creating new event
    return {
      type: 'create',
      template: dragData.template,
      date: targetDate,
    };
  }
  
  // Handle event move
  if (dragData.type === 'event' && over.id.toString().startsWith('calendar-cell-')) {
    const targetDate = over.id.toString().replace('calendar-cell-', '');
    
    return {
      type: 'move',
      eventId: dragData.eventId,
      newDate: targetDate,
    };
  }
  
  return null;
}

export function getEventTypeFromTemplate(template: string): number {
  switch (template) {
    case 'holiday':
      return 1;
    case 'marketing':
      return 2;
    case 'custom':
      return 3;
    default:
      return 3;
  }
}
