import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/use-events';
import type { Event, EventType } from '@shared/schema';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  selectedEvent: Event | null;
  newEventTypeId: number | null; 
  recommendedEventData: { title: string; suggestedDate: string } | null;
  selectedRegion: number;
  language: 'zh' | 'en';
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().nullable(),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().min(1, { message: 'End date is required' }),
  eventTypeId: z.number(),
  regionId: z.number(),
  isHoliday: z.boolean(),
});

type EventFormData = z.infer<typeof formSchema>;

export default function EventDialog({ 
  isOpen, 
  onClose, 
  selectedDate, 
  selectedEvent,
  newEventTypeId,
  recommendedEventData,
  selectedRegion, 
  language
}: EventDialogProps & { currentDate: Date }) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: null,
      startDate: selectedDate || '',
      endDate: selectedDate || '',
      eventTypeId: 2,
      regionId: selectedRegion,
      isHoliday: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (recommendedEventData) {
        form.reset({
          title: recommendedEventData.title,
          description: null,
          startDate: recommendedEventData.suggestedDate,
          endDate: recommendedEventData.suggestedDate,
          eventTypeId: 2, // Default to marketing, can be changed by user
          regionId: selectedRegion,
          isHoliday: false,
        });
      } else if (selectedEvent) {
        form.reset({
          title: selectedEvent.title,
          description: selectedEvent.description,
          startDate: selectedEvent.startDate.split('T')[0],
          endDate: selectedEvent.endDate.split('T')[0],
          eventTypeId: selectedEvent.eventTypeId,
          regionId: selectedEvent.regionId,
          isHoliday: selectedEvent.isHoliday,
        });
      } else {
        form.reset({
          title: '',
          description: null,
          startDate: selectedDate || '',
          endDate: selectedDate || '',
          eventTypeId: newEventTypeId || 2,
          regionId: selectedRegion,
          isHoliday: newEventTypeId === 1,
        });
      }
    }
  }, [isOpen, selectedEvent, recommendedEventData, selectedDate, newEventTypeId, selectedRegion, form]);

  const { data: eventTypes = [] } = useQuery<EventType[]>({
    queryKey: ['/api/event-types'],
  });

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
      onClose();
    }
  };

  function onSubmit(data: EventFormData) {
    const eventData = { ...data, description: data.description || '' };
    if (selectedEvent) {
      updateEventMutation.mutate({ ...eventData, id: selectedEvent.id });
    } else {
      createEventMutation.mutate(eventData);
    }
    onClose();
  }

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const eventTypeLabels = {
    zh: {
      1: '节假日',
      2: '营销活动',
      3: '自定义事件',
    },
    en: {
      1: 'Holiday',
      2: 'Marketing Campaign',
      3: 'Custom Event',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent
              ? (language === 'zh' ? '编辑事件' : 'Edit Event')
              : (language === 'zh' ? '创建事件' : 'Create Event')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Event Title */}
          <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'zh' ? '事件标题' : 'Event Title'} *</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'zh' ? '输入事件标题' : 'Enter event title'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* Event Type */}
          <FormField
              control={form.control}
              name="eventTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'zh' ? '事件类型' : 'Event Type'}</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {eventTypeLabels[language][type.id as keyof typeof eventTypeLabels.zh] || type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'zh' ? '开始日期' : 'Start Date'} *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'zh' ? '结束日期' : 'End Date'} *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          {/* Description */}
          <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'zh' ? '描述' : 'Description'}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={language === 'zh' ? '输入事件描述' : 'Enter event description'}
                      {...field}
                      value={field.value || ''} // Ensure value is not null
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="flex w-full items-center space-x-2">
            {selectedEvent && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                {language === 'zh' ? '删除' : 'Delete'}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleClose}>
              {language === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button type="submit">
              {selectedEvent
                ? (language === 'zh' ? '更新' : 'Update')
                : (language === 'zh' ? '创建' : 'Create')}
            </Button>
          </div>
        </form>
      </Form>
      </DialogContent>
    </Dialog>
  );
}
