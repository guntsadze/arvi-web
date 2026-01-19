import { apiClient } from "@/lib/api-client";
import { BaseApiService } from "@/services/common/base-api.service";
import {
  Group,
  GroupPost,
  CreateGroupInput,
  GroupMemberRole,
} from "@/types/groups.types";

class GroupsService extends BaseApiService<Group> {
  protected endpoint = "/groups";

  // ჯგუფების ძებნა/ლისტინგი
  getGroups(page = 1, limit = 20, search?: string) {
    let url = `${this.endpoint}?page=${page}&limit=${limit}`;
    return apiClient.get(url);
  }

  // კონკრეტული ჯგუფი Slug-ით
  getGroupBySlug(slug: string) {
    return apiClient.get(`${this.endpoint}/slug/${slug}`);
  }

  // ჯგუფის შექმნა
  createGroup(data: CreateGroupInput) {
    return apiClient.post(this.endpoint, data);
  }

  // წევრობის მართვა
  joinGroup(groupId: string) {
    return apiClient.post(`${this.endpoint}/${groupId}/join`, {});
  }

  leaveGroup(groupId: string) {
    return apiClient.post(`${this.endpoint}/${groupId}/leave`, {});
  }

  // პოსტები ჯგუფის შიგნით
  getGroupPosts(groupId: string, page = 1, limit = 20) {
    return apiClient.get(
      `${this.endpoint}/${groupId}/posts?page=${page}&limit=${limit}`,
    );
  }

  createGroupPost(
    groupId: string,
    data: { content: string; images?: string[] },
  ) {
    return apiClient.post(`${this.endpoint}/${groupId}/posts`, data);
  }

  deleteGroupPost(groupId: string, postId: string) {
    return apiClient.delete(`/groups/${groupId}/posts/${postId}`);
  }

  pinGroupPost(groupId: string, postId: string) {
    return apiClient.post(`/groups/${groupId}/posts/${postId}/pin`);
  }
}

export const groupsService = new GroupsService();
