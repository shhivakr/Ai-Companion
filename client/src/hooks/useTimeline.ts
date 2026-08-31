import { useQuery } from "@tanstack/react-query";

import { getTimeline, type TimelineType } from "@/lib/api/timeline.api";

export const timelineKeys = {
  all: ["timeline"] as const,
  list: (type: TimelineType) => [...timelineKeys.all, "list", type] as const,
};

export function useTimeline(type: TimelineType = "all") {
  const query = useQuery({
    queryKey: timelineKeys.list(type),
    queryFn: () => getTimeline(type),
  });

  return {
    timeline: query.data?.timeline ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
