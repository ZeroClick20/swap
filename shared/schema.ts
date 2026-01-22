
import { pgTable, text, serial, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Stores the SEO and Configuration data for each specific query/page
export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // e.g., 'swap-failed-unpredictable-gas-limit'
  rawQuery: text("raw_query").notNull(), // The exact user search query
  intent: text("intent").notNull(), // User intent
  pageType: text("page_type").notNull(), // 'error_resolution', 'dashboard', 'tool', 'network_tool'
  recommendedActions: jsonb("recommended_actions").$type<string[]>().notNull(), // ['swap', 'approve', 'revoke']
  problemContext: text("problem_context").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
});

// Stores simulated transaction results
export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  queryId: serial("query_id").references(() => queries.id),
  type: text("type").notNull(), // 'swap', 'approve', etc.
  status: text("status").notNull(), // 'success', 'failed', 'pending'
  simulatedGas: text("simulated_gas"),
  simulatedSlippage: text("simulated_slippage"),
  errorMessage: text("error_message"), // If failed, what error?
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertQuerySchema = createInsertSchema(queries).omit({ id: true });
export const insertSimulationSchema = createInsertSchema(simulations).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Query = typeof queries.$inferSelect;
export type InsertQuery = z.infer<typeof insertQuerySchema>;

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;

// Request types
export type RunSimulationRequest = {
  queryId: number;
  action: string;
  params?: {
    slippage?: string;
    amount?: string;
    token?: string;
  };
};

// Response types
export type SimulationResponse = {
  success: boolean;
  txHash?: string;
  error?: string;
  gasUsed?: string;
  blockNumber?: number;
};

export type QueryDetailResponse = Query;
export type QueryListResponse = Query[];
