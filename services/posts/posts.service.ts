import { apiClient } from "@/lib/api-client";
import { BaseApiService } from "@/services/common/base-api.service";

export interface Posts {
  type?: string;
  content?: string;
  images?: string[];
  videos?: string[];
  carId?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  commentsEnabled?: boolean;
  isPublic?: boolean;
  isPinned?: boolean;
  // Hashtags: #cars #bmw
  tags?: string[];
  // Mentions: ["userId1", "userId2"]
  mentions?: string[];
}

class PostsService extends BaseApiService<Posts> {
  protected endpoint = "/posts";

  // FEED
  getFeed(page = 1, limit = 20) {
    return apiClient.get(`${this.endpoint}/feed?page=${page}&limit=${limit}`);
  }

  getExplore(page = 1, limit = 20) {
    return apiClient.get(
      `${this.endpoint}/explore?page=${page}&limit=${limit}`
    );
  }

  // POSTS
  getPost(id: string) {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  createPost(data: Posts) {
    return apiClient.post(this.endpoint, data);
  }

  updatePost(id: string, data: Partial<Posts>) {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  deletePost(id: string) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  // INTERACTIONS
  likePost(id: string) {
    return apiClient.post(`${this.endpoint}/${id}/like`);
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

  // COMMENTS
  updateComment(commentId: string, content: string) {
    return apiClient.put(`${this.endpoint}/comments/${commentId}`, { content });
  }

  deleteComment(commentId: string) {
    return apiClient.delete(`${this.endpoint}/comments/${commentId}`);
  }

  getComments(postId: string, page = 1, limit = 20) {
    return apiClient.get(
      `${this.endpoint}/${postId}/comments?page=${page}&limit=${limit}`
    );
  }

  // USER POSTS (Profile)
  getByUserId(userId: string, page = 1, limit = 10) {
    return apiClient.get(
      `${this.endpoint}/user/${userId}?page=${page}&limit=${limit}`
    );
  }
}

export const postsService = new PostsService();
