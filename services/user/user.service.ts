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

  // GET /Users/profile — always the authenticated caller's own data (the
  // backend derives the user from the JWT, not a URL param) and, unlike
  // every other user-fetching endpoint, includes `completeness` for the
  // profile-completeness widget. Path is hardcoded (not this.endpoint)
  // to match the backend's actual `/Users/profile` route, mirroring
  // usersServerService.getByUsername's `/Users/by-username/...`.
  getMyProfile(): Promise<User> {
    return apiClient.get<User>("/Users/profile");
  }

  // Always targets the authenticated caller's own avatar/cover — the
  // backend derives the user from the auth token, not a URL param, so
  // this can only ever affect your own account. `_userId` is kept in the
  // signature for call-site compatibility with the shared upload widgets.
  async uploadMedia(
    _userId: string,
    type: "avatar" | "cover",
    data: { file: string },
  ) {
    return apiClient.post(`${this.endpoint}/me/${type}`, data);
  }

  async deleteUserMedia(_userId: string, type: "avatar" | "cover") {
    return apiClient.delete(`${this.endpoint}/me/${type}`);
  }
}

export const usersService = new UsersService();
