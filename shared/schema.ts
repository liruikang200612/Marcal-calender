import { pgTable, text, serial, integer, boolean, timestamp, date, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  timezone: text("timezone").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const eventTypes = pgTable("event_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(), // hex color code
  icon: text("icon").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  regionId: integer("region_id").references(() => regions.id),
  eventTypeId: integer("event_type_id").references(() => eventTypes.id),
  isHoliday: boolean("is_holiday").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const holidays = pgTable("holidays", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  regionId: integer("region_id").references(() => regions.id),
  type: text("type").notNull(), // national, religious, cultural
  isRecurring: boolean("is_recurring").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  suggestedDate: date("suggested_date"),
  confidenceScore: real("confidence_score").notNull(), // 0-1
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, archived
  regionId: integer("region_id").references(() => regions.id),
  eventTypeId: integer("event_type_id").references(() => eventTypes.id),
  reasoning: text("reasoning"), // AI reasoning for the recommendation
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const regionsRelations = relations(regions, ({ many }) => ({
  events: many(events),
  holidays: many(holidays),
  recommendations: many(recommendations),
}));

export const eventTypesRelations = relations(eventTypes, ({ many }) => ({
  events: many(events),
  recommendations: many(recommendations),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  region: one(regions, {
    fields: [events.regionId],
    references: [regions.id],
  }),
  eventType: one(eventTypes, {
    fields: [events.eventTypeId],
    references: [eventTypes.id],
  }),
}));

export const holidaysRelations = relations(holidays, ({ one }) => ({
  region: one(regions, {
    fields: [holidays.regionId],
    references: [regions.id],
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  region: one(regions, {
    fields: [recommendations.regionId],
    references: [regions.id],
  }),
  eventType: one(eventTypes, {
    fields: [recommendations.eventTypeId],
    references: [eventTypes.id],
  }),
}));

// Insert schemas
export const insertRegionSchema = createInsertSchema(regions).omit({
  id: true,
});

export const insertEventTypeSchema = createInsertSchema(eventTypes).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHolidaySchema = createInsertSchema(holidays).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;

export type EventType = typeof eventTypes.$inferSelect;
export type InsertEventType = z.infer<typeof insertEventTypeSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Holiday = typeof holidays.$inferSelect;
export type InsertHoliday = z.infer<typeof insertHolidaySchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

// Keep existing users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
