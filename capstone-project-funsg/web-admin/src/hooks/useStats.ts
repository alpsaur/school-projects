import apiClient from "../services/api-client.ts";
import { useQuery } from "@tanstack/react-query";

export interface StatItem {
  id: number;
  name: string;
  stat: number;
}

export interface StatsOverview {
  statItems: StatItem[];
}

const useStats = () => {
  const fetchStats = () =>
    apiClient.get<StatsOverview>("/admin/stats", {}).then((res) => res.data);

  return useQuery<StatsOverview, Error>({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 10 * 1000,
  });
};

export default useStats;
