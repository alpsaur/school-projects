import apiClient from "../services/api-client.ts";
import { useQuery } from "@tanstack/react-query";

export interface GroupInfoResponse {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  status: string;
  profileImagePath: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  groups: GroupInfoResponse[];
}

const useCategories = () => {
  const fetchCategories = () =>
    apiClient.get<Category[]>("/categories", {}).then((res) => res.data);

  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export default useCategories;
