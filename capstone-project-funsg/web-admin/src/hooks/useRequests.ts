import apiClient from "../services/api-client.ts";
import { Group } from "./useGroups.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useRequests = () => {
  const queryClient = useQueryClient();

  const fetchRequest = () =>
    apiClient.get<Group[]>("/admin/newGroups", {}).then((res) => res.data);

  const { data, error, isLoading } = useQuery<Group[], Error>({
    queryKey: ["newGroups"],
    queryFn: fetchRequest,
    staleTime: 1 * 1000, // 1 second
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
        queryClient.invalidateQueries(["newGroups"]);
      },
    },
  );

  const approveGroup = (groupId: number) =>
    mutation.mutate({ groupId, status: "active" });
  const rejectGroup = (groupId: number, message: string) =>
    mutation.mutate({ groupId, status: "rejected", message });

  return {
    data,
    error,
    isLoading,
    approveGroup,
    rejectGroup,
  };
};

export default useRequests;
