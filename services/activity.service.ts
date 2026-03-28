import { apiClient } from "@/lib/api";
import { BaseApiService } from "@/services/common/base-api.service";
import { PaginationParams } from "@/types/pagination.types";

class ActivityService extends BaseApiService<any> {
  protected endpoint = "/activity";

  getFeed(params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/feed`, params);
  }

  getByUserId(userId: string, params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/user/${userId}`, params);
  }
}

export const activityService = new ActivityService();
