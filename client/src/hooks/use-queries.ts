import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type MarketStatusResponse, type RunSimulationResponse } from "@shared/routes";
import { z } from "zod";

// List all queries for sidebar/dashboard
export function useQueries() {
  return useQuery({
    queryKey: [api.queries.list.path],
    queryFn: async () => {
      const res = await fetch(api.queries.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch queries");
      return api.queries.list.responses[200].parse(await res.json());
    },
  });
}

// Get specific query details by slug
export function useQueryDetail(slug: string) {
  return useQuery({
    queryKey: [api.queries.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.queries.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch query details");
      return api.queries.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

// Market Status (Gas, Price, etc.)
export function useMarketStatus() {
  return useQuery({
    queryKey: [api.market.status.path],
    queryFn: async () => {
      const res = await fetch(api.market.status.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch market status");
      return api.market.status.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Poll every 5s for realism
  });
}

// Run a simulation
export function useRunSimulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.simulation.run.input>) => {
      const res = await fetch(api.simulation.run.path, {
        method: api.simulation.run.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Simulation endpoint not found");
        throw new Error("Simulation failed");
      }
      return api.simulation.run.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.simulation.history.path] });
    },
  });
}

// Simulation History
export function useSimulationHistory() {
  return useQuery({
    queryKey: [api.simulation.history.path],
    queryFn: async () => {
      const res = await fetch(api.simulation.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.simulation.history.responses[200].parse(await res.json());
    },
  });
}
