
import { z } from 'zod';
import { insertQuerySchema, insertSimulationSchema, queries, simulations } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  queries: {
    list: {
      method: 'GET' as const,
      path: '/api/queries',
      responses: {
        200: z.array(z.custom<typeof queries.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/queries/:slug',
      responses: {
        200: z.custom<typeof queries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  simulation: {
    run: {
      method: 'POST' as const,
      path: '/api/simulate',
      input: z.object({
        querySlug: z.string(),
        action: z.string(),
        slippage: z.string().optional(),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
          txHash: z.string().optional(),
          error: z.string().optional(),
          gasUsed: z.string(),
          simulationLog: z.string(),
        }),
        404: errorSchemas.notFound,
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/simulations',
      responses: {
        200: z.array(z.custom<typeof simulations.$inferSelect>()),
      },
    }
  },
  market: {
    status: {
      method: 'GET' as const,
      path: '/api/market-status',
      responses: {
        200: z.object({
          gasPrice: z.string(),
          ethPrice: z.string(),
          congestion: z.enum(['low', 'medium', 'high']),
          blockNumber: z.number(),
        }),
      },
    }
  }
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPES
// ============================================
export type MarketStatusResponse = z.infer<typeof api.market.status.responses[200]>;
export type RunSimulationResponse = z.infer<typeof api.simulation.run.responses[200]>;
