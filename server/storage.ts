import { 
  regions, events, holidays, recommendations, eventTypes, users,
  type Region, type InsertRegion,
  type Event, type InsertEvent,
  type Holiday, type InsertHoliday,
  type Recommendation, type InsertRecommendation,
  type EventType, type InsertEventType,
  type User, type InsertUser
} from "@shared/schema";
import { supabase } from './supabase';

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Regions
  getRegions(): Promise<Region[]>;
  getRegion(id: number): Promise<Region | undefined>;
  createRegion(region: InsertRegion): Promise<Region>;

  // Event Types
  getEventTypes(): Promise<EventType[]>;
  createEventType(eventType: InsertEventType): Promise<EventType>;

  // Events
  getEvents(regionId?: number, startDate?: string, endDate?: string): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Holidays
  getHolidays(regionId?: number, startDate?: string, endDate?: string): Promise<Holiday[]>;
  createHoliday(holiday: InsertHoliday): Promise<Holiday>;

  // Recommendations
  getRecommendations(regionId?: number, status?: string): Promise<Recommendation[]>;
  getRecommendation(id: number): Promise<Recommendation | undefined>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: number, recommendation: Partial<InsertRecommendation>): Promise<Recommendation>;
  deleteRecommendation(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
    if (error) throw error;
    return data || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase.from('users').insert(insertUser).select().single();
    if (error) throw error;
    return data;
  }

  // Regions
  async getRegions(): Promise<Region[]> {
    const { data, error } = await supabase.from('regions').select('*').eq('is_active', true);
    if (error) throw error;
    return data;
  }

  async getRegion(id: number): Promise<Region | undefined> {
    const { data, error } = await supabase.from('regions').select('*').eq('id', id).single();
    if (error) throw error;
    return data || undefined;
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const { data, error } = await supabase.from('regions').insert(insertRegion).select().single();
    if (error) throw error;
    return data;
  }

  // Event Types
  async getEventTypes(): Promise<EventType[]> {
    const { data, error } = await supabase.from('event_types').select('*');
    if (error) throw error;
    return data;
  }

  async createEventType(insertEventType: InsertEventType): Promise<EventType> {
    const { data, error } = await supabase.from('event_types').insert(insertEventType).select().single();
    if (error) throw error;
    return data;
  }

  // Events
  async getEvents(regionId?: number, startDate?: string, endDate?: string): Promise<Event[]> {
    let query = supabase.from('events').select('*');

    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    if (endDate) {
      query = query.lte('end_date', endDate);
    }

    const { data, error } = await query.order('start_date');
    if (error) throw error;

    // Manually map snake_case from DB to camelCase for the Event type
    return data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      regionId: event.region_id,
      eventTypeId: event.event_type_id,
      isHoliday: event.is_holiday,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    }));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return undefined;
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      regionId: data.region_id,
      eventTypeId: data.event_type_id,
      isHoliday: data.is_holiday,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const dbEvent: { [key: string]: any } = {
      title: insertEvent.title,
      description: insertEvent.description,
      start_date: insertEvent.startDate,
      end_date: insertEvent.endDate,
      is_holiday: insertEvent.isHoliday,
    };
    if (insertEvent.regionId !== undefined) {
      dbEvent.region_id = insertEvent.regionId;
    }
    if (insertEvent.eventTypeId !== undefined) {
      dbEvent.event_type_id = insertEvent.eventTypeId;
    }

    const { data, error } = await supabase.from('events').insert(dbEvent).select().single();
    if (error) {
      console.error('Supabase createEvent error:', error);
      throw error;
    }
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      regionId: data.region_id,
      eventTypeId: data.event_type_id,
      isHoliday: data.is_holiday,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const dbEvent: { [key: string]: any } = { updated_at: new Date().toISOString() };
    if (event.title !== undefined) dbEvent.title = event.title;
    if (event.description !== undefined) dbEvent.description = event.description;
    if (event.startDate !== undefined) dbEvent.start_date = event.startDate;
    if (event.endDate !== undefined) dbEvent.end_date = event.endDate;
    if (event.regionId !== undefined) dbEvent.region_id = event.regionId;
    if (event.eventTypeId !== undefined) dbEvent.event_type_id = event.eventTypeId;
    if (event.isHoliday !== undefined) dbEvent.is_holiday = event.isHoliday;

    const { data, error } = await supabase.from('events').update(dbEvent).eq('id', id).select().single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      regionId: data.region_id,
      eventTypeId: data.event_type_id,
      isHoliday: data.is_holiday,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deleteEvent(id: number): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  }

  // Holidays
  async getHolidays(regionId?: number, startDate?: string, endDate?: string): Promise<Holiday[]> {
    let query = supabase.from('holidays').select('*');

    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date');
    if (error) throw error;
    return data.map(holiday => ({
      id: holiday.id,
      name: holiday.name,
      description: holiday.description,
      date: holiday.date,
      regionId: holiday.region_id,
      type: holiday.type,
      isRecurring: holiday.is_recurring,
      createdAt: holiday.created_at,
    }));
  }

  async createHoliday(holiday: InsertHoliday): Promise<Holiday> {
    const { data, error } = await supabase.from('holidays').insert(holiday).select().single();
    if (error) throw error;
    return data;
  }

  // Recommendations
  async getRecommendations(regionId?: number, status?: string): Promise<Recommendation[]> {
    let query = supabase.from('recommendations').select('*');

    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(rec => ({
      id: rec.id,
      title: rec.title,
      description: rec.description,
      suggestedDate: rec.suggested_date,
      confidenceScore: rec.confidence_score,
      status: rec.status,
      regionId: rec.region_id,
      eventTypeId: rec.event_type_id,
      reasoning: rec.reasoning,
      createdAt: rec.created_at,
      updatedAt: rec.updated_at,
    }));
  }

  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    const { data, error } = await supabase.from('recommendations').select('*').eq('id', id).single();
    if (error) throw error;
    return data || undefined;
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const dbRecommendation: { [key: string]: any } = {
      title: insertRecommendation.title,
      description: insertRecommendation.description,
      suggested_date: insertRecommendation.suggestedDate,
      confidence_score: insertRecommendation.confidenceScore,
      status: insertRecommendation.status,
      reasoning: insertRecommendation.reasoning,
    };
    if (insertRecommendation.regionId !== undefined) {
      dbRecommendation.region_id = insertRecommendation.regionId;
    }
    if (insertRecommendation.eventTypeId !== undefined) {
      dbRecommendation.event_type_id = insertRecommendation.eventTypeId;
    }

    const { data, error } = await supabase.from('recommendations').insert(dbRecommendation).select().single();
    if (error) throw error;
    return data;
  }

  async updateRecommendation(id: number, recommendation: Partial<InsertRecommendation>): Promise<Recommendation> {
    const dbRecommendation: { [key: string]: any } = { updated_at: new Date().toISOString() };
    if (recommendation.title !== undefined) dbRecommendation.title = recommendation.title;
    if (recommendation.description !== undefined) dbRecommendation.description = recommendation.description;
    if (recommendation.suggestedDate !== undefined) dbRecommendation.suggested_date = recommendation.suggestedDate;
    if (recommendation.confidenceScore !== undefined) dbRecommendation.confidence_score = recommendation.confidenceScore;
    if (recommendation.status !== undefined) dbRecommendation.status = recommendation.status;
    if (recommendation.regionId !== undefined) dbRecommendation.region_id = recommendation.regionId;
    if (recommendation.eventTypeId !== undefined) dbRecommendation.event_type_id = recommendation.eventTypeId;
    if (recommendation.reasoning !== undefined) dbRecommendation.reasoning = recommendation.reasoning;

    const { data, error } = await supabase.from('recommendations').update(dbRecommendation).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteRecommendation(id: number): Promise<void> {
    const { error } = await supabase.from('recommendations').delete().eq('id', id);
    if (error) throw error;
  }
}

export const storage = new DatabaseStorage();
