import type { Event as SharedEvent } from '@shared/schema';

export type Event = SharedEvent;

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'holiday' | 'marketing' | 'custom';
  color: string;
  regionId: number;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  lunarDate: string;
  events: CalendarEvent[];
  holidays: CalendarHoliday[];
}

export interface CalendarHoliday {
  id: number;
  name: string;
  date: string;
  type: string;
  description?: string;
}

export interface CalendarRegion {
  id: number;
  name: string;
  code: string;
  timezone: string;
  flag: string;
}

export interface CalendarRecommendation {
  id: number;
  title: string;
  description: string;
  suggestedDate?: string;
  confidenceScore: number;
  status: 'pending' | 'accepted' | 'rejected' | 'archived';
  reasoning: string;
}

export type CalendarView = 'month' | 'list';
export type Language = 'zh' | 'en';

export interface CalendarFilters {
  holidays: boolean;
  marketing: boolean;
  custom: boolean;
}
