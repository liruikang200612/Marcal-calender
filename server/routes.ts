import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertRecommendationSchema, insertHolidaySchema } from "@shared/schema";
import { generateRecommendations } from "./services/deepseek";
import { getWeatherData } from "./services/lunar";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Regions API
  app.get("/api/regions", async (req, res) => {
    try {
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regions" });
    }
  });

  // Event Types API
  app.get("/api/event-types", async (req, res) => {
    try {
      const eventTypes = await storage.getEventTypes();
      res.json(eventTypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event types" });
    }
  });

  // Events API
  app.get("/api/events", async (req, res) => {
    try {
      const { regionId, startDate, endDate } = req.query;
      const events = await storage.getEvents(
        regionId ? Number(regionId) : undefined,
        startDate as string,
        endDate as string
      );
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
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

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Event creation validation error:", error);
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(Number(req.params.id), validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Holidays API
  app.get("/api/holidays", async (req, res) => {
    try {
      const { regionId, startDate, endDate } = req.query;
      const holidays = await storage.getHolidays(
        regionId ? Number(regionId) : undefined,
        startDate as string,
        endDate as string
      );
      res.json(holidays);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch holidays" });
    }
  });

  app.post("/api/holidays", async (req, res) => {
    try {
      const validatedData = insertHolidaySchema.parse(req.body);
      const holiday = await storage.createHoliday(validatedData);
      res.status(201).json(holiday);
    } catch (error) {
      res.status(400).json({ error: "Invalid holiday data" });
    }
  });

  // Recommendations API
  app.get("/api/recommendations", async (req, res) => {
    try {
      const { regionId, status } = req.query;
      const recommendations = await storage.getRecommendations(
        regionId ? Number(regionId) : undefined,
        status as string
      );
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/recommendations/generate", async (req, res) => {
    try {
      const { regionId, startDate, endDate, language } = req.body;
      
      // Get existing events and holidays for context
      const events = await storage.getEvents(regionId, startDate, endDate);
      const holidays = await storage.getHolidays(regionId, startDate, endDate);
      
      // Generate AI recommendations
      const aiRecommendations = await generateRecommendations({
        language,
        regionId,
        startDate,
        endDate,
        existingEvents: events,
        holidays
      });

      // Save recommendations to database
      const savedRecommendations = await Promise.all(
        aiRecommendations.map(rec => storage.createRecommendation(rec))
      );

      res.json(savedRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  app.put("/api/recommendations/:id/accept", async (req, res) => {
    try {
      const recommendation = await storage.updateRecommendation(
        Number(req.params.id),
        { status: "accepted" }
      );
      
      // Optionally create an event from the recommendation
      if (req.body.createEvent) {
        const eventData = {
          title: recommendation.title,
          description: recommendation.description,
          startDate: recommendation.suggestedDate!,
          endDate: recommendation.suggestedDate!,
          regionId: recommendation.regionId!,
          eventTypeId: recommendation.eventTypeId!,
          isHoliday: false
        };
        await storage.createEvent(eventData);
      }
      
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ error: "Failed to accept recommendation" });
    }
  });

  app.put("/api/recommendations/:id/reject", async (req, res) => {
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

  app.delete("/api/recommendations/:id", async (req, res) => {
    try {
      await storage.deleteRecommendation(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete recommendation" });
    }
  });

  // Lunar calendar API
  app.get("/api/lunar/:date", async (req, res) => {
    try {
      const lunarData = getWeatherData(req.params.date);
      res.json(lunarData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lunar data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
