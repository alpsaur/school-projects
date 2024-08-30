import { User } from "./useUsers.ts";
import apiClient from "../services/api-client.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useProfile = () => {
  const queryClient = useQueryClient();

  const fetchProfile = () =>
    apiClient.get<User>("users/profile").then((res) => res.data);

  const { data, isLoading, error } = useQuery<User, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 60 * 1000,
  });

  const updateProfileImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<User>(
        "users/profileImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
    onError: (error) => {
      console.error("Error uploading profile image:", error);
    },
  });

  return { data, isLoading, error, updateProfileImage };
};

export default useProfile;
