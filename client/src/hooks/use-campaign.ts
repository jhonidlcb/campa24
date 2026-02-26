import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertSupporter, type InsertActivity } from "@shared/routes";

// ============================================
// SUPPORTERS
// ============================================

export function useCreateSupporter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSupporter) => {
      const res = await fetch(api.supporters.create.path, {
        method: api.supporters.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to join campaign');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.supporters.count.path] });
    },
  });
}

export function useSupporterCount() {
  return useQuery({
    queryKey: [api.supporters.count.path],
    queryFn: async () => {
      const res = await fetch(api.supporters.count.path);
      if (!res.ok) throw new Error('Failed to fetch count');
      return res.json() as Promise<{ count: number }>;
    },
    // Refresh count every 30 seconds for live feeling
    refetchInterval: 30000,
  });
}

// ============================================
// ACTIVITIES
// ============================================

export function useActivities() {
  return useQuery({
    queryKey: [api.activities.list.path],
    queryFn: async () => {
      const res = await fetch(api.activities.list.path);
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertActivity) => {
      const res = await fetch(api.activities.create.path, {
        method: api.activities.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Failed to create activity');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.activities.list.path] });
    },
  });
}
