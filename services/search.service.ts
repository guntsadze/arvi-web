import { apiClient } from "@/lib/api";
import { BaseApiService } from "@/services/common/base-api.service";

// ==================== TYPES ====================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  followersCount: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  nickname: string | null;
  year?: number;
  isPublic: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string | null;
  };
}

export interface Post {
  id: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  privacy: "PUBLIC" | "PRIVATE" | "SECRET";
  coverImage?: string | null;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string | null;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate?: string | null;
  isPrivate: boolean;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string | null;
  };
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  make: string;
  model: string;
  year?: number;
  price?: number;
  status: "ACTIVE" | "SOLD" | "INACTIVE";
  images?: string[];
}

export interface SearchResults {
  users: User[];
  cars: Car[];
  posts: Post[];
  groups: Group[];
  events: Event[];
  listings: Listing[];
}

export interface SearchParams {
  query: string;
  type?: "users" | "cars" | "posts" | "groups" | "events" | "listings";
  page?: number;
  limit?: number;
}

export interface TrendingHashtag {
  id: string;
  name: string;
  postsCount: number;
}

export interface PopularMake {
  make: string;
  count: number;
}

// ==================== SERVICE ====================

class SearchService extends BaseApiService<any> {
  protected endpoint = "/search";

  /**
   * Global search across all entities
   * @param params - Search parameters including query, type, and pagination
   * @returns Promise with search results
   */
  async globalSearch(params: SearchParams): Promise<SearchResults> {
    const { query, type, page, limit } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("q", query); // ✅ 'q' instead of 'query'

    if (type) {
      queryParams.append("type", type);
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    if (limit) {
      queryParams.append("limit", limit.toString());
    }

    const response = await apiClient.get(
      `${this.endpoint}/global?${queryParams.toString()}`
    );

    console.log(response);

    return response;
  }

  /**
   * Search users by username, first name, or last name
   * @param query - Search query string
   * @param limit - Maximum number of results (default: 20)
   * @returns Promise with array of users
   */
  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    const queryParams = new URLSearchParams({
      q: query, // ✅ 'q' instead of 'query'
      limit: limit.toString(),
    });

    const response = await apiClient.get(
      `${this.endpoint}/users?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * Get trending hashtags
   * @param limit - Maximum number of hashtags (default: 20)
   * @returns Promise with array of trending hashtags
   */
  async getTrendingHashtags(limit: number = 20): Promise<TrendingHashtag[]> {
    const response = await apiClient.get(
      `${this.endpoint}/hashtags/trending?limit=${limit}` // ✅ hashtags/trending
    );

    return response.data;
  }

  /**
   * Get popular car makes with their counts
   * @returns Promise with array of popular makes
   */
  async getPopularMakes(): Promise<PopularMake[]> {
    const response = await apiClient.get(`${this.endpoint}/cars/makes`); // ✅ cars/makes
    return response.data;
  }

  /**
   * Helper method to search specific entity type
   * @param type - Entity type to search
   * @param query - Search query string
   * @param limit - Maximum number of results
   * @returns Promise with array of results for the specified type
   */
  async searchByType(
    type: "users" | "cars" | "posts" | "groups" | "events" | "listings",
    query: string,
    limit: number = 10
  ): Promise<any[]> {
    const results = await this.globalSearch({
      query,
      type,
      limit,
    });

    return results[type] || [];
  }
}

export const searchService = new SearchService();
