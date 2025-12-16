// services/social/social.service.ts
import { apiClient } from "@/lib/api-client";
import { BaseApiService } from "@/services/common/base-api.service";

class SocialService extends BaseApiService<any> {
  protected endpoint = "/social";

  toggleFollow(userId: string) {
    return apiClient.post(`${this.endpoint}/follow/${userId}`);
  }
}

export const socialService = new SocialService();
