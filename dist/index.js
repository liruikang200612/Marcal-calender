// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anonymous key must be provided.");
}
var supabase = createClient(supabaseUrl, supabaseAnonKey);

// server/storage.ts
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error) throw error;
    return data || void 0;
  }
  async getUserByUsername(username) {
    const { data, error } = await supabase.from("users").select("*").eq("username", username).single();
    if (error) throw error;
    return data || void 0;
  }
  async createUser(insertUser) {
    const { data, error } = await supabase.from("users").insert(insertUser).select().single();
    if (error) throw error;
    return data;
  }
  // Regions
  async getRegions() {
    const { data, error } = await supabase.from("regions").select("*").eq("is_active", true);
    if (error) throw error;
    return data;
  }
  async getRegion(id) {
    const { data, error } = await supabase.from("regions").select("*").eq("id", id).single();
    if (error) throw error;
    return data || void 0;
  }
  async createRegion(insertRegion) {
    const { data, error } = await supabase.from("regions").insert(insertRegion).select().single();
    if (error) throw error;
    return data;
  }
  // Event Types
  async getEventTypes() {
    const { data, error } = await supabase.from("event_types").select("*");
    if (error) throw error;
    return data;
  }
  async createEventType(insertEventType) {
    const { data, error } = await supabase.from("event_types").insert(insertEventType).select().single();
    if (error) throw error;
    return data;
  }
  // Events
  async getEvents(regionId, startDate, endDate) {
    let query = supabase.from("events").select("*");
    if (regionId) {
      query = query.eq("region_id", regionId);
    }
    if (startDate) {
      query = query.gte("start_date", startDate);
    }
    if (endDate) {
      query = query.lte("end_date", endDate);
    }
    const { data, error } = await query.order("start_date");
    if (error) throw error;
    return data.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      regionId: event.region_id,
      eventTypeId: event.event_type_id,
      isHoliday: event.is_holiday,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    }));
  }
  async getEvent(id) {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
    if (error) throw error;
    if (!data) return void 0;
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
      updatedAt: data.updated_at
    };
  }
  async createEvent(insertEvent) {
    const dbEvent = {
      title: insertEvent.title,
      description: insertEvent.description,
      start_date: insertEvent.startDate,
      end_date: insertEvent.endDate,
      is_holiday: insertEvent.isHoliday
    };
    if (insertEvent.regionId !== void 0) {
      dbEvent.region_id = insertEvent.regionId;
    }
    if (insertEvent.eventTypeId !== void 0) {
      dbEvent.event_type_id = insertEvent.eventTypeId;
    }
    const { data, error } = await supabase.from("events").insert(dbEvent).select().single();
    if (error) {
      console.error("Supabase createEvent error:", error);
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
      updatedAt: data.updated_at
    };
  }
  async updateEvent(id, event) {
    const dbEvent = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (event.title !== void 0) dbEvent.title = event.title;
    if (event.description !== void 0) dbEvent.description = event.description;
    if (event.startDate !== void 0) dbEvent.start_date = event.startDate;
    if (event.endDate !== void 0) dbEvent.end_date = event.endDate;
    if (event.regionId !== void 0) dbEvent.region_id = event.regionId;
    if (event.eventTypeId !== void 0) dbEvent.event_type_id = event.eventTypeId;
    if (event.isHoliday !== void 0) dbEvent.is_holiday = event.isHoliday;
    const { data, error } = await supabase.from("events").update(dbEvent).eq("id", id).select().single();
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
      updatedAt: data.updated_at
    };
  }
  async deleteEvent(id) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
  }
  // Holidays
  async getHolidays(regionId, startDate, endDate) {
    let query = supabase.from("holidays").select("*");
    if (regionId) {
      query = query.eq("region_id", regionId);
    }
    if (startDate) {
      query = query.gte("date", startDate);
    }
    if (endDate) {
      query = query.lte("date", endDate);
    }
    const { data, error } = await query.order("date");
    if (error) throw error;
    return data.map((holiday) => ({
      id: holiday.id,
      name: holiday.name,
      description: holiday.description,
      date: holiday.date,
      regionId: holiday.region_id,
      type: holiday.type,
      isRecurring: holiday.is_recurring,
      createdAt: holiday.created_at
    }));
  }
  async createHoliday(holiday) {
    const { data, error } = await supabase.from("holidays").insert(holiday).select().single();
    if (error) throw error;
    return data;
  }
  // Recommendations
  async getRecommendations(regionId, status) {
    let query = supabase.from("recommendations").select("*");
    if (regionId) {
      query = query.eq("region_id", regionId);
    }
    if (status) {
      query = query.eq("status", status);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((rec) => ({
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
      updatedAt: rec.updated_at
    }));
  }
  async getRecommendation(id) {
    const { data, error } = await supabase.from("recommendations").select("*").eq("id", id).single();
    if (error) throw error;
    return data || void 0;
  }
  async createRecommendation(insertRecommendation) {
    const dbRecommendation = {
      title: insertRecommendation.title,
      description: insertRecommendation.description,
      suggested_date: insertRecommendation.suggestedDate,
      confidence_score: insertRecommendation.confidenceScore,
      status: insertRecommendation.status,
      reasoning: insertRecommendation.reasoning
    };
    if (insertRecommendation.regionId !== void 0) {
      dbRecommendation.region_id = insertRecommendation.regionId;
    }
    if (insertRecommendation.eventTypeId !== void 0) {
      dbRecommendation.event_type_id = insertRecommendation.eventTypeId;
    }
    const { data, error } = await supabase.from("recommendations").insert(dbRecommendation).select().single();
    if (error) throw error;
    return data;
  }
  async updateRecommendation(id, recommendation) {
    const dbRecommendation = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (recommendation.title !== void 0) dbRecommendation.title = recommendation.title;
    if (recommendation.description !== void 0) dbRecommendation.description = recommendation.description;
    if (recommendation.suggestedDate !== void 0) dbRecommendation.suggested_date = recommendation.suggestedDate;
    if (recommendation.confidenceScore !== void 0) dbRecommendation.confidence_score = recommendation.confidenceScore;
    if (recommendation.status !== void 0) dbRecommendation.status = recommendation.status;
    if (recommendation.regionId !== void 0) dbRecommendation.region_id = recommendation.regionId;
    if (recommendation.eventTypeId !== void 0) dbRecommendation.event_type_id = recommendation.eventTypeId;
    if (recommendation.reasoning !== void 0) dbRecommendation.reasoning = recommendation.reasoning;
    const { data, error } = await supabase.from("recommendations").update(dbRecommendation).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }
  async deleteRecommendation(id) {
    const { error } = await supabase.from("recommendations").delete().eq("id", id);
    if (error) throw error;
  }
};
var storage = new DatabaseStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, date, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  timezone: text("timezone").notNull(),
  isActive: boolean("is_active").default(true).notNull()
});
var eventTypes = pgTable("event_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  // hex color code
  icon: text("icon").notNull()
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  regionId: integer("region_id").references(() => regions.id),
  eventTypeId: integer("event_type_id").references(() => eventTypes.id),
  isHoliday: boolean("is_holiday").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var holidays = pgTable("holidays", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  regionId: integer("region_id").references(() => regions.id),
  type: text("type").notNull(),
  // national, religious, cultural
  isRecurring: boolean("is_recurring").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  suggestedDate: date("suggested_date"),
  confidenceScore: real("confidence_score").notNull(),
  // 0-1
  status: text("status").notNull().default("pending"),
  // pending, accepted, rejected, archived
  regionId: integer("region_id").references(() => regions.id),
  eventTypeId: integer("event_type_id").references(() => eventTypes.id),
  reasoning: text("reasoning"),
  // AI reasoning for the recommendation
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var regionsRelations = relations(regions, ({ many }) => ({
  events: many(events),
  holidays: many(holidays),
  recommendations: many(recommendations)
}));
var eventTypesRelations = relations(eventTypes, ({ many }) => ({
  events: many(events),
  recommendations: many(recommendations)
}));
var eventsRelations = relations(events, ({ one }) => ({
  region: one(regions, {
    fields: [events.regionId],
    references: [regions.id]
  }),
  eventType: one(eventTypes, {
    fields: [events.eventTypeId],
    references: [eventTypes.id]
  })
}));
var holidaysRelations = relations(holidays, ({ one }) => ({
  region: one(regions, {
    fields: [holidays.regionId],
    references: [regions.id]
  })
}));
var recommendationsRelations = relations(recommendations, ({ one }) => ({
  region: one(regions, {
    fields: [recommendations.regionId],
    references: [regions.id]
  }),
  eventType: one(eventTypes, {
    fields: [recommendations.eventTypeId],
    references: [eventTypes.id]
  })
}));
var insertRegionSchema = createInsertSchema(regions).omit({
  id: true
});
var insertEventTypeSchema = createInsertSchema(eventTypes).omit({
  id: true
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertHolidaySchema = createInsertSchema(holidays).omit({
  id: true,
  createdAt: true
});
var insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/services/deepseek.ts
import OpenAI from "openai";
var deepseek = new OpenAI({
  baseURL: "https://api.aihubmix.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-5TLjMukdVTDBGibBDc2bE478EfD44d8e9089D06914D84916"
});
var regionFootballCulture = {
  1: { name: "\u4E2D\u56FD", culture: "\u4E2D\u8D85\u8054\u8D5B\u3001\u56FD\u8DB3\u3001\u4E9A\u6D32\u676F\u3001\u4E16\u754C\u676F\u70ED\u60C5", popularTeams: "\u5E7F\u5DDE\u6052\u5927\u3001\u4E0A\u6D77\u4E0A\u6E2F\u3001\u5317\u4EAC\u56FD\u5B89" },
  2: { name: "\u7F8E\u56FD", culture: "MLS\u3001\u4E16\u754C\u676F\u3001\u6B27\u6D32\u4E94\u5927\u8054\u8D5B\u5173\u6CE8", popularTeams: "LAFC\u3001\u897F\u96C5\u56FE\u6D77\u6E7E\u4EBA\u3001\u4E9A\u7279\u5170\u5927\u8054" },
  3: { name: "\u52A0\u62FF\u5927", culture: "MLS\u3001\u4E16\u754C\u676F\u3001\u6B27\u6D32\u8054\u8D5B", popularTeams: "\u591A\u4F26\u591AFC\u3001\u6E29\u54E5\u534E\u767D\u5E3D\u3001\u8499\u7279\u5229\u5C14\u51B2\u51FB" },
  4: { name: "\u6B27\u6D32", culture: "\u4E94\u5927\u8054\u8D5B\u3001\u6B27\u51A0\u3001\u6B27\u6D32\u676F\u3001\u4E16\u754C\u676F", popularTeams: "\u7687\u9A6C\u3001\u5DF4\u8428\u3001\u66FC\u8054\u3001\u62DC\u4EC1\u3001\u5DF4\u9ECE" },
  5: { name: "\u65E5\u672C", culture: "J\u8054\u8D5B\u3001\u4E9A\u6D32\u676F\u3001\u4E16\u754C\u676F\u3001\u6B27\u6D32\u8054\u8D5B\u5173\u6CE8", popularTeams: "\u6D66\u548C\u7EA2\u94BB\u3001\u9E7F\u5C9B\u9E7F\u89D2\u3001\u5DDD\u5D0E\u524D\u950B" },
  6: { name: "\u97E9\u56FD", culture: "K\u8054\u8D5B\u3001\u4E9A\u6D32\u676F\u3001\u4E16\u754C\u676F\u3001\u6B27\u6D32\u8054\u8D5B", popularTeams: "\u5168\u5317\u73B0\u4EE3\u3001\u851A\u5C71\u73B0\u4EE3\u3001\u9996\u5C14FC" },
  7: { name: "\u8D8A\u5357", culture: "V\u8054\u8D5B\u3001\u4E1C\u5357\u4E9A\u8DB3\u7403\u3001\u4E16\u754C\u676F\u3001\u6B27\u6D32\u8054\u8D5B", popularTeams: "\u6CB3\u5185FC\u3001\u80E1\u5FD7\u660E\u5E02FC\u3001\u5E73\u9633FC" },
  8: { name: "\u5370\u5EA6\u5C3C\u897F\u4E9A", culture: "\u5370\u5C3C\u8D85\u7EA7\u8054\u8D5B\u3001\u4E1C\u5357\u4E9A\u8DB3\u7403\u3001\u4E16\u754C\u676F", popularTeams: "\u4F69\u5C14\u897F\u4E9A\u96C5\u52A0\u8FBE\u3001\u5DF4\u5398\u8054\u3001\u963F\u96F7\u9A6CFC" },
  9: { name: "\u6CF0\u56FD", culture: "\u6CF0\u8D85\u8054\u8D5B\u3001\u4E1C\u5357\u4E9A\u8DB3\u7403\u3001\u4E16\u754C\u676F", popularTeams: "\u6B66\u91CC\u5357\u8054\u3001\u66FC\u8C37\u8054\u5408\u3001\u6625\u6B66\u91CCFC" },
  10: { name: "\u5DF4\u897F", culture: "\u5DF4\u7532\u8054\u8D5B\u3001\u5357\u7F8E\u89E3\u653E\u8005\u676F\u3001\u4E16\u754C\u676F\u8DB3\u7403\u738B\u56FD", popularTeams: "\u5F17\u62C9\u95E8\u6208\u3001\u79D1\u6797\u8482\u5B89\u3001\u5E15\u5C14\u6885\u62C9\u65AF" },
  11: { name: "\u963F\u6839\u5EF7", culture: "\u963F\u7532\u8054\u8D5B\u3001\u5357\u7F8E\u8DB3\u7403\u3001\u4E16\u754C\u676F\u3001\u6885\u897F\u6587\u5316", popularTeams: "\u535A\u5361\u9752\u5E74\u3001\u6CB3\u5E8A\u3001\u7ADE\u6280\u4FF1\u4E50\u90E8" },
  12: { name: "\u58A8\u897F\u54E5", culture: "\u58A8\u8D85\u8054\u8D5B\u3001\u4E2D\u5317\u7F8E\u8DB3\u7403\u3001\u4E16\u754C\u676F", popularTeams: "\u7F8E\u6D32\u961F\u3001\u74DC\u8FBE\u62C9\u54C8\u62C9\u3001\u84DD\u5341\u5B57" }
};
var prompts = {
  zh: (params) => {
    const regionInfo = regionFootballCulture[params.regionId] || { name: "\u672A\u77E5\u533A\u57DF", culture: "\u8DB3\u7403\u6587\u5316", popularTeams: "\u672C\u5730\u7403\u961F" };
    return `
    \u4F60\u662FWinner12\u8DB3\u7403\u9884\u6D4B\u4EA7\u54C1\u7684\u4E13\u4E1A\u8425\u9500\u63A8\u5E7F\u4EBA\u5458\u3002Winner12\u662F\u4E00\u6B3E\u4F7F\u7528AI\u6280\u672F\u8FDB\u884C\u8DB3\u7403\u6BD4\u8D5B\u9884\u6D4B\u7684\u521B\u65B0\u4EA7\u54C1\uFF0C\u5E2E\u52A9\u7528\u6237\u63D0\u9AD8\u8DB3\u7403\u6295\u6CE8\u548C\u9884\u6D4B\u7684\u51C6\u786E\u6027\u3002

    ## \u4EA7\u54C1\u80CC\u666F
    - \u4EA7\u54C1\u540D\u79F0\uFF1AWinner12 AI\u8DB3\u7403\u9884\u6D4B
    - \u6838\u5FC3\u529F\u80FD\uFF1AAI\u9A71\u52A8\u7684\u8DB3\u7403\u6BD4\u8D5B\u7ED3\u679C\u9884\u6D4B
    - \u76EE\u6807\u7528\u6237\uFF1A\u8DB3\u7403\u7231\u597D\u8005\u3001\u4F53\u80B2\u6295\u6CE8\u8005\u3001\u6570\u636E\u5206\u6790\u5E08
    - \u7ADE\u4E89\u4F18\u52BF\uFF1A\u9AD8\u7CBE\u5EA6\u9884\u6D4B\u7B97\u6CD5\u3001\u5B9E\u65F6\u6570\u636E\u5206\u6790\u3001\u7528\u6237\u53CB\u597D\u754C\u9762

    ## \u76EE\u6807\u533A\u57DF\u5206\u6790
    \u63A8\u5E7F\u533A\u57DF\uFF1A${regionInfo.name}
    \u8DB3\u7403\u6587\u5316\u7279\u8272\uFF1A${regionInfo.culture}
    \u70ED\u95E8\u7403\u961F\uFF1A${regionInfo.popularTeams}

    ## \u8425\u9500\u65E5\u5386\u6570\u636E
    \u65F6\u95F4\u6BB5: ${params.startDate} \u5230 ${params.endDate}
    
    \u73B0\u6709\u4E8B\u4EF6:
    ${params.existingEvents.map((e) => `- ${e.title} \u5728 ${e.startDate} (${e.description || "\u65E0\u63CF\u8FF0"})`).join("\n")}
    
    \u6B64\u671F\u95F4\u7684\u8282\u5047\u65E5:
    ${params.holidays.map((h) => `- ${h.name} \u5728 ${h.date} (${h.description || "\u65E0\u63CF\u8FF0"})`).join("\n")}

    ## \u8425\u9500\u63A8\u8350\u7B56\u7565\u8981\u6C42
    \u8BF7\u57FA\u4E8EWinner12\u8DB3\u7403\u9884\u6D4B\u4EA7\u54C1\u7279\u6027\uFF0C\u4E3A${regionInfo.name}\u5730\u533A\u751F\u62103-5\u4E2A\u9AD8\u8F6C\u5316\u7387\u7684\u8DB3\u7403\u76F8\u5173\u8425\u9500\u8282\u65E5\u63A8\u8350\uFF1A

    ### \u4F18\u5148\u63A8\u8350\u7C7B\u578B\uFF1A
    1. **\u91CD\u5927\u8DB3\u7403\u8D5B\u4E8B\u671F\u95F4** - \u4E16\u754C\u676F\u3001\u6B27\u6D32\u676F\u3001\u7F8E\u6D32\u676F\u3001\u4E9A\u6D32\u676F\u7B49\u56FD\u9645\u5927\u8D5B
    2. **\u8054\u8D5B\u5173\u952E\u8282\u70B9** - \u8D5B\u5B63\u5F00\u59CB\u3001\u8F6C\u4F1A\u7A97\u53E3\u3001\u5B63\u540E\u8D5B\u3001\u603B\u51B3\u8D5B
    3. **\u672C\u5730\u8DB3\u7403\u6587\u5316\u8282\u65E5** - \u5F53\u5730\u7403\u961F\u6210\u7ACB\u7EAA\u5FF5\u65E5\u3001\u91CD\u8981\u6BD4\u8D5B\u7EAA\u5FF5\u65E5
    4. **\u8DB3\u7403\u76F8\u5173\u56FD\u9645\u65E5** - \u4E16\u754C\u8DB3\u7403\u65E5\u3001\u53CD\u79CD\u65CF\u4E3B\u4E49\u65E5\u7B49
    5. **\u4F53\u80B2\u535A\u5F69\u70ED\u70B9\u65F6\u671F** - \u91CD\u8981\u6BD4\u8D5B\u524D\u540E\u3001\u8D54\u7387\u6CE2\u52A8\u671F

    ### \u8425\u9500\u89D2\u5EA6\u5EFA\u8BAE\uFF1A
    - \u5F3A\u8C03AI\u9884\u6D4B\u7684\u51C6\u786E\u6027\u548C\u79D1\u6280\u611F
    - \u7ED3\u5408\u5F53\u5730\u8DB3\u7403\u6587\u5316\u548C\u70ED\u95E8\u7403\u961F
    - \u7A81\u51FA\u4EA7\u54C1\u5728\u91CD\u8981\u6BD4\u8D5B\u4E2D\u7684\u4EF7\u503C
    - \u5229\u7528\u8DB3\u7403\u60C5\u611F\u8425\u9500\u548C\u793E\u533A\u5F52\u5C5E\u611F
    - \u5C55\u793A\u6570\u636E\u5206\u6790\u7684\u4E13\u4E1A\u6027\u548C\u53EF\u9760\u6027

    ### \u907F\u514D\u63A8\u8350\uFF1A
    - \u4E0E\u8DB3\u7403\u65E0\u5173\u7684\u666E\u901A\u8282\u65E5
    - \u53EF\u80FD\u5F15\u8D77\u4E89\u8BAE\u7684\u654F\u611F\u8BDD\u9898
    - \u4E0E\u73B0\u6709\u4E8B\u4EF6\u51B2\u7A81\u7684\u65F6\u95F4\u70B9
    - \u7F3A\u4E4F\u5546\u4E1A\u8F6C\u5316\u4EF7\u503C\u7684\u7EAA\u5FF5\u65E5

    ## \u8F93\u51FA\u8981\u6C42
    \u5BF9\u4E8E\u6BCF\u4E2A\u63A8\u8350\uFF0C\u8BF7\u63D0\u4F9B\uFF1A
    - title: \u5438\u5F15\u8DB3\u7403\u7231\u597D\u8005\u7684\u8425\u9500\u6D3B\u52A8\u540D\u79F0
    - description: \u8BE6\u7EC6\u7684Winner12\u4EA7\u54C1\u63A8\u5E7F\u7B56\u7565\uFF0C\u5305\u62EC\u76EE\u6807\u7528\u6237\u3001\u8425\u9500\u5356\u70B9\u3001\u9884\u671F\u6548\u679C
    - suggestedDate: YYYY-MM-DD\u683C\u5F0F\u7684\u6700\u4F73\u8425\u9500\u65F6\u673A
    - confidenceScore: 0.7-1.0\u4E4B\u95F4\u7684\u63A8\u8350\u4FE1\u5FC3\u5EA6\uFF08\u57FA\u4E8E\u8DB3\u7403\u76F8\u5173\u6027\u548C\u5546\u4E1A\u4EF7\u503C\uFF09
    - reasoning: \u8BE6\u7EC6\u8BF4\u660E\u4E3A\u4EC0\u4E48\u8FD9\u4E2A\u65F6\u673A\u9002\u5408\u63A8\u5E7FWinner12\uFF0C\u5305\u62EC\u8DB3\u7403\u80CC\u666F\u3001\u7528\u6237\u9700\u6C42\u3001\u7ADE\u4E89\u4F18\u52BF
    - eventTypeId: 2\u8868\u793A\u8425\u9500\u6D3B\u52A8

    \u8BF7\u4E25\u683C\u6309\u7167\u4EE5\u4E0BJSON\u683C\u5F0F\u56DE\u590D\uFF1A
    {
      "recommendations": [
        {
          "title": "Winner12\u8DB3\u7403\u9884\u6D4B\u8425\u9500\u6D3B\u52A8\u6807\u9898",
          "description": "\u9488\u5BF9\u8DB3\u7403\u7231\u597D\u8005\u7684\u8BE6\u7EC6\u63A8\u5E7F\u7B56\u7565",
          "suggestedDate": "YYYY-MM-DD",
          "confidenceScore": 0.85,
          "reasoning": "\u57FA\u4E8E\u8DB3\u7403\u6587\u5316\u548CWinner12\u4EA7\u54C1\u7279\u6027\u7684\u63A8\u8350\u7406\u7531",
          "eventTypeId": 2
        }
      ]
    }
  `;
  },
  en: (params) => {
    const regionInfo = regionFootballCulture[params.regionId] || { name: "Unknown Region", culture: "Football culture", popularTeams: "Local teams" };
    return `
    You are a professional marketing specialist for Winner12, an AI-powered football match prediction product. Winner12 uses advanced AI technology to help users improve their football betting and prediction accuracy.

    ## Product Background
    - Product Name: Winner12 AI Football Prediction
    - Core Function: AI-driven football match result prediction
    - Target Users: Football enthusiasts, sports bettors, data analysts
    - Competitive Advantage: High-precision prediction algorithms, real-time data analysis, user-friendly interface

    ## Target Region Analysis
    Marketing Region: ${regionInfo.name}
    Football Culture: ${regionInfo.culture}
    Popular Teams: ${regionInfo.popularTeams}

    ## Marketing Calendar Data
    Time Period: ${params.startDate} to ${params.endDate}
    
    Existing Events:
    ${params.existingEvents.map((e) => `- ${e.title} on ${e.startDate} (${e.description || "No description"})`).join("\n")}
    
    Holidays during this period:
    ${params.holidays.map((h) => `- ${h.name} on ${h.date} (${h.description || "No description"})`).join("\n")}

    ## Marketing Strategy Requirements
    Based on Winner12's football prediction product features, generate 3-5 high-conversion football-related marketing holiday recommendations for ${regionInfo.name}:

    ### Priority Recommendation Types:
    1. **Major Football Events** - World Cup, European Championship, Copa America, Asian Cup, etc.
    2. **League Key Moments** - Season start, transfer windows, playoffs, finals
    3. **Local Football Culture Days** - Local team anniversaries, important match commemorations
    4. **Football-related International Days** - World Football Day, Anti-Racism Day, etc.
    5. **Sports Betting Hot Periods** - Before/after important matches, odds fluctuation periods

    ### Marketing Angle Suggestions:
    - Emphasize AI prediction accuracy and technology
    - Combine local football culture and popular teams
    - Highlight product value during important matches
    - Use football emotional marketing and community belonging
    - Showcase data analysis professionalism and reliability

    ### Avoid Recommending:
    - Non-football related ordinary holidays
    - Potentially controversial sensitive topics
    - Time conflicts with existing events
    - Commemorative days lacking commercial conversion value

    ## Output Requirements
    For each recommendation, provide:
    - title: Marketing activity name that attracts football enthusiasts
    - description: Detailed Winner12 product promotion strategy, including target users, marketing selling points, expected results
    - suggestedDate: Optimal marketing timing in YYYY-MM-DD format
    - confidenceScore: Recommendation confidence between 0.7-1.0 (based on football relevance and commercial value)
    - reasoning: Detailed explanation of why this timing suits Winner12 promotion, including football background, user needs, competitive advantages
    - eventTypeId: 2 for marketing campaigns

    Please respond strictly in the following JSON format:
    {
      "recommendations": [
        {
          "title": "Winner12 Football Prediction Marketing Campaign Title",
          "description": "Detailed promotion strategy targeting football enthusiasts",
          "suggestedDate": "YYYY-MM-DD",
          "confidenceScore": 0.85,
          "reasoning": "Recommendation reason based on football culture and Winner12 product features",
          "eventTypeId": 2
        }
      ]
    }
  `;
  }
};
async function generateRecommendations(params) {
  const { language, ...restParams } = params;
  const prompt = prompts[language](restParams);
  try {
    const response = await deepseek.chat.completions.create({
      model: "DeepSeek-V3-Fast",
      messages: [
        {
          role: "system",
          content: language === "zh" ? "\u4F60\u662FWinner12\u8DB3\u7403\u9884\u6D4B\u4EA7\u54C1\u7684\u4E13\u4E1A\u8425\u9500\u63A8\u5E7F\u4E13\u5BB6\u3002\u4E13\u95E8\u4E3A\u8DB3\u7403\u7231\u597D\u8005\u548C\u4F53\u80B2\u6295\u6CE8\u7528\u6237\u5236\u5B9A\u7CBE\u51C6\u7684\u8425\u9500\u7B56\u7565\uFF0C\u57FA\u4E8E\u8DB3\u7403\u6587\u5316\u548C\u8D5B\u4E8B\u8282\u594F\u751F\u6210\u9AD8\u8F6C\u5316\u7387\u7684\u8425\u9500\u63A8\u8350\u3002" : "You are a professional marketing expert for Winner12 football prediction product. Specializing in creating precise marketing strategies for football enthusiasts and sports betting users, generating high-conversion marketing recommendations based on football culture and match rhythms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });
    let content = response.choices[0].message.content || '{"recommendations": []}';
    content = content.replace(/```json\n|\n```/g, "").trim();
    const result = JSON.parse(content);
    return result.recommendations.map((rec) => ({
      title: rec.title,
      description: rec.description,
      suggestedDate: rec.suggestedDate,
      confidenceScore: Math.max(0.7, Math.min(1, rec.confidenceScore)),
      status: "pending",
      regionId: params.regionId,
      eventTypeId: rec.eventTypeId,
      reasoning: rec.reasoning
    }));
  } catch (error) {
    console.error("DeepSeek API error:", error);
    const regionInfo = regionFootballCulture[params.regionId] || { name: "\u76EE\u6807\u533A\u57DF", culture: "\u8DB3\u7403\u6587\u5316", popularTeams: "\u672C\u5730\u7403\u961F" };
    if (language === "zh") {
      return [{
        title: `Winner12 ${regionInfo.name}\u8DB3\u7403\u9884\u6D4B\u63A8\u5E7F\u6D3B\u52A8`,
        description: `\u9488\u5BF9${regionInfo.name}\u8DB3\u7403\u7231\u597D\u8005\u7684Winner12 AI\u9884\u6D4B\u4EA7\u54C1\u4E13\u9879\u63A8\u5E7F\uFF0C\u7ED3\u5408\u5F53\u5730\u8DB3\u7403\u6587\u5316\u7279\u8272\uFF0C\u63D0\u5347\u7528\u6237\u5BF9AI\u8DB3\u7403\u9884\u6D4B\u7684\u8BA4\u77E5\u548C\u4F7F\u7528\u7387`,
        suggestedDate: params.endDate,
        confidenceScore: 0.8,
        status: "pending",
        regionId: params.regionId,
        eventTypeId: 2,
        reasoning: `${regionInfo.name}\u5730\u533A\u5177\u6709\u6D53\u539A\u7684\u8DB3\u7403\u6587\u5316\u6C1B\u56F4\uFF0CWinner12\u7684AI\u9884\u6D4B\u529F\u80FD\u80FD\u591F\u6EE1\u8DB3\u5F53\u5730\u8DB3\u7403\u7231\u597D\u8005\u5BF9\u6BD4\u8D5B\u5206\u6790\u7684\u9700\u6C42\uFF0C\u662F\u7406\u60F3\u7684\u4EA7\u54C1\u63A8\u5E7F\u65F6\u673A`
      }];
    } else {
      return [{
        title: `Winner12 ${regionInfo.name} Football Prediction Campaign`,
        description: `Specialized Winner12 AI prediction product promotion targeting ${regionInfo.name} football enthusiasts, combining local football culture to enhance user awareness and adoption of AI football prediction`,
        suggestedDate: params.endDate,
        confidenceScore: 0.8,
        status: "pending",
        regionId: params.regionId,
        eventTypeId: 2,
        reasoning: `${regionInfo.name} region has a strong football culture atmosphere, Winner12's AI prediction features can meet local football fans' needs for match analysis, making it an ideal product promotion opportunity`
      }];
    }
  }
}

// server/services/lunar.ts
function getWeatherData(gregorianDate) {
  const date2 = new Date(gregorianDate);
  const lunarMonths = [
    "\u6B63\u6708",
    "\u4E8C\u6708",
    "\u4E09\u6708",
    "\u56DB\u6708",
    "\u4E94\u6708",
    "\u516D\u6708",
    "\u4E03\u6708",
    "\u516B\u6708",
    "\u4E5D\u6708",
    "\u5341\u6708",
    "\u5341\u4E00\u6708",
    "\u5341\u4E8C\u6708"
  ];
  const lunarDays = [
    "\u521D\u4E00",
    "\u521D\u4E8C",
    "\u521D\u4E09",
    "\u521D\u56DB",
    "\u521D\u4E94",
    "\u521D\u516D",
    "\u521D\u4E03",
    "\u521D\u516B",
    "\u521D\u4E5D",
    "\u521D\u5341",
    "\u5341\u4E00",
    "\u5341\u4E8C",
    "\u5341\u4E09",
    "\u5341\u56DB",
    "\u5341\u4E94",
    "\u5341\u516D",
    "\u5341\u4E03",
    "\u5341\u516B",
    "\u5341\u4E5D",
    "\u4E8C\u5341",
    "\u5EFF\u4E00",
    "\u5EFF\u4E8C",
    "\u5EFF\u4E09",
    "\u5EFF\u56DB",
    "\u5EFF\u4E94",
    "\u5EFF\u516D",
    "\u5EFF\u4E03",
    "\u5EFF\u516B",
    "\u5EFF\u4E5D",
    "\u4E09\u5341"
  ];
  const dayOfYear = Math.floor((date2.getTime() - new Date(date2.getFullYear(), 0, 0).getTime()) / (1e3 * 60 * 60 * 24));
  const lunarMonth = Math.floor(dayOfYear % 355 / 29.5);
  const lunarDay = Math.floor(dayOfYear % 355 % 29.5);
  return {
    year: date2.getFullYear(),
    month: lunarMonth + 1,
    day: lunarDay + 1,
    monthName: lunarMonths[lunarMonth] || "\u6B63\u6708",
    dayName: lunarDays[lunarDay] || "\u521D\u4E00",
    isLeapMonth: false
  };
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/regions", async (req, res) => {
    try {
      const regions2 = await storage.getRegions();
      res.json(regions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regions" });
    }
  });
  app2.get("/api/event-types", async (req, res) => {
    try {
      const eventTypes2 = await storage.getEventTypes();
      res.json(eventTypes2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event types" });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const { regionId, startDate, endDate } = req.query;
      const events2 = await storage.getEvents(
        regionId ? Number(regionId) : void 0,
        startDate,
        endDate
      );
      res.json(events2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });
  app2.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(Number(req.params.id));
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });
  app2.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Event creation validation error:", error);
      res.status(400).json({ error: "Invalid event data" });
    }
  });
  app2.put("/api/events/:id", async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(Number(req.params.id), validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });
  app2.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });
  app2.get("/api/holidays", async (req, res) => {
    try {
      const { regionId, startDate, endDate } = req.query;
      const holidays2 = await storage.getHolidays(
        regionId ? Number(regionId) : void 0,
        startDate,
        endDate
      );
      res.json(holidays2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch holidays" });
    }
  });
  app2.post("/api/holidays", async (req, res) => {
    try {
      const validatedData = insertHolidaySchema.parse(req.body);
      const holiday = await storage.createHoliday(validatedData);
      res.status(201).json(holiday);
    } catch (error) {
      res.status(400).json({ error: "Invalid holiday data" });
    }
  });
  app2.get("/api/recommendations", async (req, res) => {
    try {
      const { regionId, status } = req.query;
      const recommendations2 = await storage.getRecommendations(
        regionId ? Number(regionId) : void 0,
        status
      );
      res.json(recommendations2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });
  app2.post("/api/recommendations/generate", async (req, res) => {
    try {
      const { regionId, startDate, endDate, language } = req.body;
      const events2 = await storage.getEvents(regionId, startDate, endDate);
      const holidays2 = await storage.getHolidays(regionId, startDate, endDate);
      const aiRecommendations = await generateRecommendations({
        language,
        regionId,
        startDate,
        endDate,
        existingEvents: events2,
        holidays: holidays2
      });
      const savedRecommendations = await Promise.all(
        aiRecommendations.map((rec) => storage.createRecommendation(rec))
      );
      res.json(savedRecommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });
  app2.put("/api/recommendations/:id/accept", async (req, res) => {
    try {
      const recommendation = await storage.updateRecommendation(
        Number(req.params.id),
        { status: "accepted" }
      );
      if (req.body.createEvent) {
        const eventData = {
          title: recommendation.title,
          description: recommendation.description,
          startDate: recommendation.suggestedDate,
          endDate: recommendation.suggestedDate,
          regionId: recommendation.regionId,
          eventTypeId: recommendation.eventTypeId,
          isHoliday: false
        };
        await storage.createEvent(eventData);
      }
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ error: "Failed to accept recommendation" });
    }
  });
  app2.put("/api/recommendations/:id/reject", async (req, res) => {
    try {
      const recommendation = await storage.updateRecommendation(
        Number(req.params.id),
        { status: "rejected" }
      );
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject recommendation" });
    }
  });
  app2.delete("/api/recommendations/:id", async (req, res) => {
    try {
      await storage.deleteRecommendation(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete recommendation" });
    }
  });
  app2.get("/api/lunar/:date", async (req, res) => {
    try {
      const lunarData = getWeatherData(req.params.date);
      res.json(lunarData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lunar data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
