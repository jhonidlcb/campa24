import { useQuery } from "@tanstack/react-query";
import { type News, type Proposal, type Activity, type HomeContent } from "@shared/schema";

export function useActivities() {
  return useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
}

export function useHomeContent() {
  return useQuery<HomeContent>({
    queryKey: ["/api/home-content"],
  });
}

export function useNews() {
  return useQuery<News[]>({
    queryKey: ["/api/news"],
  });
}

export function useProposals() {
  return useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });
}
