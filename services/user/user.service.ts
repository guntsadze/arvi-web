import { apiClient } from "@/lib/api";
import { BaseApiService } from "@/services/common/base-api.service";
import { PaginationParams } from "@/types/pagination.types";
import { User } from "@/types/user";

class UsersService extends BaseApiService<User> {
  protected endpoint = "/users";

  getFollowers(userId: string, params?: PaginationParams) {
    return apiClient.get(`${this.endpoint}/${userId}/followers`, params);
  }

  getFollowing(userId: string, params?: PaginationParams) {
    return apiClient.get(`${this.endpoint}/${userId}/following`, params);
  }

  findAll(params: PaginationParams) {
    return apiClient.get(this.endpoint, params);
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
