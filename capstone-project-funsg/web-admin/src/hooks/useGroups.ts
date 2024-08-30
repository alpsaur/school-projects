import apiClient from "../services/api-client.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, UserProfileResponse } from "./useEvents.ts";

export interface Group {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  categoryId: number;
  categoryName: string;
  status: string;
  profileImagePath: string;
  host: string;
  numOfMember: number;
  numOfEvent: number;
  members: UserProfileResponse[];
  events: Event[];
}

export interface GroupQuery {
  page: number;
  pageSize: number;
  categoryId: number | undefined;
}

export interface PaginatedGroups {
  groups: Group[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const useGroups = (query: GroupQuery) => {
  const queryClient = useQueryClient();
  const requestParams: Record<string, number> = {
    _start: (query.page - 1) * query.pageSize,
    _limit: query.pageSize,
  };

  if (query.categoryId) {
    requestParams["categoryId"] = query.categoryId;
  }

  const fetchGroups = () =>
    apiClient
      .get<PaginatedGroups>("/admin/groups", {
        params: requestParams,
      })
      .then((res) => res.data);

  const { data, isLoading, error } = useQuery<PaginatedGroups, Error>({
    queryKey: ["groups", query],
    queryFn: fetchGroups,
    staleTime: 10 * 1000,
    keepPreviousData: true,
  });

  const mutation = useMutation(
    ({
      groupId,
      status,
      message,
    }: {
      groupId: number;
      status: string;
      message?: string;
    }) =>
      apiClient.post(`/admin/groups/${groupId}/status`, { status, message }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["groups", query]);
      },
    },
  );

  const activateGroup = (groupId: number) =>
    mutation.mutate({ groupId, status: "active" });
  const deactivateGroup = (groupId: number, message: string) =>
    mutation.mutate({ groupId, status: "inactive", message });

  return {
    data,
    isLoading,
    error,
    activateGroup,
    deactivateGroup,
  };
};
export default useGroups;
