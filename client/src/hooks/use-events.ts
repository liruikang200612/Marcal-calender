import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Language } from '@/lib/i18n';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import type { Event, Holiday, InsertEvent } from '@shared/schema';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageProvider';

export function useEvents(regionId: number, currentDate: Date) {
  const queryClient = useQueryClient();
  const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

  const queryKey = ['/api/events', { regionId, startDate, endDate }];

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/events', { regionId, startDate, endDate }],
    queryFn: async () => {
      const params = new URLSearchParams({
        regionId: regionId.toString(),
        startDate,
        endDate,
      });
      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
  });

  const { data: holidays = [], isLoading: holidaysLoading } = useQuery<Holiday[]>({
    queryKey: ['/api/holidays', { regionId, startDate, endDate }],
    queryFn: async () => {
      const params = new URLSearchParams({
        regionId: regionId.toString(),
        startDate,
        endDate,
      });
      const response = await fetch(`/api/holidays?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch holidays');
      }
      return response.json();
    },
  });

  return {
    events,
    holidays,
    isLoading: eventsLoading || holidaysLoading,
  };
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async (event: InsertEvent) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ description: t('eventCreateSuccess') });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async (event: Event) => {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ description: t('eventUpdateSuccess') });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ description: t('eventDeleteSuccess') });
    },
  });
}
