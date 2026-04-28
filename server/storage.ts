import { db } from "./db";
import { eq, inArray, asc, desc } from "drizzle-orm";
import {
  stations,
  newsAlerts,
  feedback,
  priceReports,
  type Station,
  type InsertStation,
  type NewsAlertRow,
  type InsertFeedback,
  type InsertPriceReport,
} from "@shared/schema";

export interface IStorage {
  listStations(): Promise<Station[]>;
  getStation(id: string): Promise<Station | undefined>;
  getStationsByIds(ids: string[]): Promise<Station[]>;
  createStation(input: InsertStation): Promise<Station>;
  listNewsAlerts(): Promise<NewsAlertRow[]>;
  createFeedback(input: InsertFeedback): Promise<void>;
  createPriceReport(input: InsertPriceReport): Promise<void>;
}

export class DbStorage implements IStorage {
  async listStations(): Promise<Station[]> {
    return db.select().from(stations).orderBy(asc(stations.name));
  }

  async getStation(id: string): Promise<Station | undefined> {
    const rows = await db.select().from(stations).where(eq(stations.id, id)).limit(1);
    return rows[0];
  }

  async getStationsByIds(ids: string[]): Promise<Station[]> {
    if (ids.length === 0) return [];
    return db.select().from(stations).where(inArray(stations.id, ids));
  }

  async createStation(input: InsertStation): Promise<Station> {
    const [row] = await db.insert(stations).values(input).returning();
    return row;
  }

  async listNewsAlerts(): Promise<NewsAlertRow[]> {
    return db.select().from(newsAlerts).orderBy(desc(newsAlerts.createdAt));
  }

  async createFeedback(input: InsertFeedback): Promise<void> {
    await db.insert(feedback).values(input);
  }

  async createPriceReport(input: InsertPriceReport): Promise<void> {
    await db.insert(priceReports).values(input);
  }
}

export const storage: IStorage = new DbStorage();
