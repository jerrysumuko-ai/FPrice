import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stations = pgTable("stations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  petrolPrice: integer("petrol_price").notNull(),
  dieselPrice: integer("diesel_price").notNull(),
  isOpen: boolean("is_open").notNull().default(true),
  distance: text("distance").notNull().default(""),
  rating: numeric("rating").notNull().default("0"),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  image: text("image").notNull().default(""),
  lastUpdated: text("last_updated").notNull().default(""),
  phone: text("phone"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const newsAlerts = pgTable("news_alerts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull().default("info"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  stationId: text("station_id").references(() => stations.id, {
    onDelete: "set null",
  }),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const priceReports = pgTable("price_reports", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  stationId: text("station_id")
    .references(() => stations.id, { onDelete: "cascade" })
    .notNull(),
  petrolPrice: integer("petrol_price"),
  dieselPrice: integer("diesel_price"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertStationSchema = createInsertSchema(stations).omit({
  createdAt: true,
});
export const insertNewsAlertSchema = createInsertSchema(newsAlerts).omit({
  createdAt: true,
});
export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});
export const insertPriceReportSchema = createInsertSchema(priceReports).omit({
  id: true,
  createdAt: true,
});

export type Station = typeof stations.$inferSelect;
export type InsertStation = z.infer<typeof insertStationSchema>;
export type NewsAlertRow = typeof newsAlerts.$inferSelect;
export type InsertNewsAlert = z.infer<typeof insertNewsAlertSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type PriceReport = typeof priceReports.$inferSelect;
export type InsertPriceReport = z.infer<typeof insertPriceReportSchema>;
