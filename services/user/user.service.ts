import { apiClient } from "@/lib/api";
import { BaseApiService } from "@/services/common/base-api.service";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

class UsersService extends BaseApiService<User> {
  protected endpoint = "/users";

  getByUsername(username: string, options?: { headers?: HeadersInit }) {
    return apiClient.get(`/Users/by-username/${username}`, undefined, options);
  }

  // 1. გასწორებული getFollowers - იღებს userId-ს და pagination-ს
  getFollowers(userId: string, params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`${this.endpoint}/${userId}/followers?${query}`);
  }

  // 2. თუ დაგჭირდება getFollowing (ვის აფოლოვებს იუზერი)
  getFollowing(userId: string, params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`${this.endpoint}/${userId}/following?${query}`);
  }

  findAll(params: { page: number; pageSize: number }) {
    return apiClient.get(`${this.endpoint}`);
  }

  async uploadMedia(
    userId: string,
    type: "avatar" | "cover",
    data: { file: string },
  ) {
    return apiClient.post(`${this.endpoint}/${userId}/${type}`, data);
  }

  async deleteUserMedia(userId: string, type: "avatar" | "cover") {
    return apiClient.delete(`${this.endpoint}/${userId}/${type}`);
  }
}

export const usersService = new UsersService();
