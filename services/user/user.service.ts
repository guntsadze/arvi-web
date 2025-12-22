import { apiClient } from "@/lib/api-client";
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

  getByUsername(username: string) {
    return apiClient.get(`${this.endpoint}/by-username/${username}`);
  }

  findAll(params: { page: number; pageSize: number }) {
    return apiClient.get(`${this.endpoint}`);
  }

  async uploadAvatar(userId: string, data: { file: string }) {
    return apiClient.post(`/users/${userId}/avatar`, data);
  }

  async uploadCover(userId: string, data: { file: string }) {
    return apiClient.post(`/users/${userId}/cover`, data);
  }

  // 🗑 Delete methods
  async deleteAvatar(userId: string) {
    return apiClient.delete(`${this.endpoint}/${userId}/avatar`);
  }

  async deleteCover(userId: string) {
    return apiClient.delete(`${this.endpoint}/${userId}/cover`);
  }
}

export const usersService = new UsersService();
