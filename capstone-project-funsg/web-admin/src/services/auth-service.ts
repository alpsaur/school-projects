import apiClient from "./api-client.ts";
import { LoginIn } from "../pages/LoginPage.tsx";

export const signIn = async (loginRequest: LoginIn) => {
  try {
    const response = await apiClient.post("/auth/login", loginRequest);
    return response.data;
  } catch (error) {
    console.error("Failed to log in:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Failed to log out:", error);
  }
};
