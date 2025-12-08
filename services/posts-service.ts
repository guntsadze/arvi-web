import { apiClient } from "@/lib/api-client";

export const postsApi = {
  getFeed: (page = 1) => apiClient.get(`/posts/feed?page=${page}&limit=20`),

  getExplore: (page = 1) =>
    apiClient.get(`/posts/explore?page=${page}&limit=20`),

  getPost: (id: string) => apiClient.get(`/posts/${id}`),

  createPost: (data: any) => apiClient.post("/posts", data),

  updatePost: (id: string, data: any) => apiClient.put(`/posts/${id}`, data),

  deletePost: (id: string) => apiClient.delete(`/posts/${id}`),

  likePost: (id: string) => apiClient.post(`/posts/${id}/like`),

  savePost: (id: string, collectionName?: string) =>
    apiClient.post(`/posts/${id}/save`, { collectionName }),

  addComment: (postId: string, content: string, parentId?: string) =>
    apiClient.post(`/posts/${postId}/comments`, { content, parentId }),

  getComments: (postId: string, page = 1) =>
    apiClient.get(`/posts/${postId}/comments?page=${page}`),
};
