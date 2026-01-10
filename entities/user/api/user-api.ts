import { apiClient } from "@/shared/api/client";
import type { User } from "../model/types";

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    return apiClient.get("users").json<User[]>();
  },

  getUser: async (id: number): Promise<User> => {
    return apiClient.get(`users/${id}`).json<User>();
  },
};
