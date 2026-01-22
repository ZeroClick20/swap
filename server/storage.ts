
import { db } from "./db";
import {
  queries,
  simulations,
  type Query,
  type InsertQuery,
  type InsertSimulation,
  type Simulation
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Queries
  getAllQueries(): Promise<Query[]>;
  getQueryBySlug(slug: string): Promise<Query | undefined>;
  createQueries(queriesList: InsertQuery[]): Promise<Query[]>;

  // Simulations
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  getSimulations(): Promise<Simulation[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllQueries(): Promise<Query[]> {
    return await db.select().from(queries);
  }

  async getQueryBySlug(slug: string): Promise<Query | undefined> {
    const [result] = await db.select().from(queries).where(eq(queries.slug, slug));
    return result;
  }

  async createQueries(queriesList: InsertQuery[]): Promise<Query[]> {
    return await db.insert(queries).values(queriesList).returning();
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const [result] = await db.insert(simulations).values(simulation).returning();
    return result;
  }

  async getSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).orderBy(simulations.createdAt);
  }
}

export const storage = new DatabaseStorage();
