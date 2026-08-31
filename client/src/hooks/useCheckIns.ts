import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCheckIn,
  getCheckIns,
  getTodayCheckIn,
  type CreateCheckInPayload,
} from "@/lib/api/checkin.api";

const checkInKeys = {
  all: ["check-ins"] as const,
  list: () => [...checkInKeys.all, "list"] as const,
  today: () => [...checkInKeys.all, "today"] as const,
};

export function useCheckIns() {
  const queryClient = useQueryClient();

  const checkInsQuery = useQuery({
    queryKey: checkInKeys.list(),
    queryFn: getCheckIns,
  });

  const todayCheckInQuery = useQuery({
    queryKey: checkInKeys.today(),
    queryFn: getTodayCheckIn,
  });

  const createCheckInMutation = useMutation({
    mutationFn: (payload: CreateCheckInPayload) => createCheckIn(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: checkInKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: checkInKeys.today(),
      });
    },
  });

  return {
    checkIns: checkInsQuery.data?.checkIns ?? [],
    todayCheckIn: todayCheckInQuery.data?.checkIn ?? null,

    isLoading: checkInsQuery.isLoading || todayCheckInQuery.isLoading,

    isCreating: createCheckInMutation.isPending,

    error:
      checkInsQuery.error ??
      todayCheckInQuery.error ??
      createCheckInMutation.error,

    createCheckIn: createCheckInMutation.mutateAsync,
  };
}
