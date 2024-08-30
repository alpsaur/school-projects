import apiClient from "../services/api-client.ts";
import { useQuery } from "@tanstack/react-query";
import { Group } from "./useGroups.ts";

const useCategorisedGroups = (categoryId: number) => {
  const fetchGroups = () =>
    apiClient
      .get<Group[]>(`/categories/${categoryId}/groups`, {})
      .then((res) => res.data);

  return useQuery<Group[], Error>({
    queryKey: ["categoriesGroups", categoryId],
    queryFn: fetchGroups,
    staleTime: 10 * 1000, //10s
    enabled: !!categoryId,
  });
};

export default useCategorisedGroups;
