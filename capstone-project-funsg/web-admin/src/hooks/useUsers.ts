import apiClient from "../services/api-client.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface User {
  userId: number;
  name: string;
  email: string;
  profileImage: string;
  status: string;
  createdAt: string;
  ie_Tendancy: number;
  ns_Tendancy: number;
  tf_Tendancy: number;
  jp_Tendancy: number;
  events: string[];
  groups: string[];
  hostedGroups: string[];
}

export interface UserQuery {
  page: number;
  pageSize: number;
}

export interface PaginatedUsers {
  users: User[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const useUsers = (query: UserQuery) => {
  const queryClient = useQueryClient();
  const requestParams: Record<string, number> = {
    _start: (query.page - 1) * query.pageSize,
    _limit: query.pageSize,
  };
  const fetchUsers = () =>
    apiClient
      .get<PaginatedUsers>("/admin/users", {
        params: requestParams,
      })
      .then((res) => res.data);

  const { data, isLoading, error } = useQuery<PaginatedUsers, Error>({
    queryKey: ["users", query],
    queryFn: fetchUsers,
    staleTime: 10 * 1000, //10s
  });

  const mutation = useMutation(
    ({
      userId,
      status,
      message,
    }: {
      userId: number;
      status: string;
      message?: string;
    }) => apiClient.post(`/admin/users/${userId}/status`, { status, message }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", query]);
      },
    },
  );

  const enableUser = (userId: number) =>
    mutation.mutate({ userId, status: "active" });
  const banUser = (userId: number) =>
    mutation.mutate({ userId, status: "banned" });

  return {
    data,
    isLoading,
    error,
    enableUser,
    banUser,
  };
};

export default useUsers;
