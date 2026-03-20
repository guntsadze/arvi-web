import { apiClient } from "@/lib/api";
import { BaseApiService } from "@/services/common/base-api.service";
import { PaginationParams } from "@/types/pagination.types";
import { Posts } from "@/types/post.types";

class PostsService extends BaseApiService<Posts> {
  protected endpoint = "/posts";

  getFeed(params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/feed`, params);
  }

  getExplore(params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/explore`, params);
  }

  getPost(id: string) {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  createPost(data: Posts) {
    return apiClient.post(this.endpoint, data);
  }

  updatePost(id: string, data: Posts) {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  updateGroupPost(id: string, data: Posts) {
    return apiClient.put(`${this.endpoint}/group/${id}`, data);
  }

  deletePost(id: string) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  // INTERACTIONS
  likePost(id: string) {
    return apiClient.post(`${this.endpoint}/${id}/like`);
  }

  likeGroupPost(id: string) {
    return apiClient.post(`${this.endpoint}/group/${id}/like`);
  }

  savePost(id: string, collectionName?: string) {
    return apiClient.post(`${this.endpoint}/${id}/save`, {
      collectionName,
    });
  }

  // COMMENTS
  addComment(postId: string, content: string, parentId?: string) {
    return apiClient.post(`${this.endpoint}/${postId}/comments`, {
      content,
      parentId,
    });
  }

  addGroupComment(groupPostId: string, content: string, parentId?: string) {
    return apiClient.post(`${this.endpoint}/group/${groupPostId}/comments`, {
      content,
      parentId,
    });
  }

  // COMMENTS
  updateComment(commentId: string, content: string) {
    return apiClient.put(`${this.endpoint}/comments/${commentId}`, { content });
  }

  deleteComment(commentId: string) {
    return apiClient.delete(`${this.endpoint}/comments/${commentId}`);
  }

  getComments(postId: string, params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/${postId}/comments`, params);
  }

  getGroupComments(postId: string, params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/group/${postId}/comments`, params);
  }

  getByUserId(userId: string, params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/user/${userId}`, params);
  }

  getGroupPost(id: string) {
    return apiClient.get(`${this.endpoint}/group/${id}`);
  }
}

export const postsService = new PostsService();
