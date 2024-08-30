import apiClient from "../services/api-client.ts";
import { useQuery } from "@tanstack/react-query";

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

const useUserData = () => {
  const fetchUsers = () =>
    apiClient.get<User[]>("/users", {}).then((res) => res.data);

  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 10 * 1000,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useUserData;
