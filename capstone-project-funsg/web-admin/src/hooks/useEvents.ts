import apiClient from "../services/api-client.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface UserProfileResponse {
  userId: number;
  name: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  start: string;
  end: string;
  location: string;
  groupId: number;
  groupName: string;
  categoryName: string;
  createdAt: string;
  createdBy: UserProfileResponse;
  status: string;
  maxParticipants: number;
  profileImagePath: string;
  eventParticipants: UserProfileResponse[];
}

export interface EventQuery {
  page: number;
  pageSize: number;
  selectedCategoryId: number | undefined;
}

export interface PaginatedEvents {
  events: Event[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const useEvents = (query: EventQuery) => {
  const queryClient = useQueryClient();

  const requestParams: Record<string, number> = {
    _start: (query.page - 1) * query.pageSize,
    _limit: query.pageSize,
  };

  if (query.selectedCategoryId) {
    requestParams["categoryId"] = query.selectedCategoryId;
  }

  const fetchEvents = () =>
    apiClient
      .get<PaginatedEvents>("/admin/events", { params: requestParams })
      .then((res) => res.data);

  const { data, isLoading, error } = useQuery<PaginatedEvents, Error>({
    queryKey: ["events", query],
    queryFn: fetchEvents,
    staleTime: 10 * 1000,
    keepPreviousData: true,
  });

  const mutation = useMutation(
    ({
      eventId,
      status,
      message,
    }: {
      eventId: number;
      status: string;
      message?: string;
    }) => apiClient.post(`admin/events/${eventId}/status`, { status, message }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events", query]);
      },
    },
  );

  const deleteEvent = (eventId: number) => {
    mutation.mutate({ eventId, status: "canceled" });
  };
  const reOpenEvent = (eventId: number) => {
    mutation.mutate({ eventId, status: "open" });
  };

  const updateAllEventsMutation = useMutation(
    () => apiClient.get("/admin/events/status"),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events", query]);
      },
    },
  );

  const updateAllEventsStatus = () => {
    updateAllEventsMutation.mutate();
  };

  return {
    data,
    error,
    isLoading,
    deleteEvent,
    reOpenEvent,
    updateAllEventsStatus,
  };
};

export default useEvents;
