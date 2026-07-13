import { apiClient } from "@/lib/api";
import {
  PaginatedResult,
  PaginationParams,
  QueryParams,
} from "@/types/pagination.types";
import { AxiosRequestConfig } from "axios";

export abstract class BaseApiService<T> {
  protected abstract endpoint: string;

  /**
   * Create a new record
   */
  async create(data: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.post<T>(`${this.endpoint}`, data, config);
  }

  /**
   * Find all records with optional pagination and filters
   */
  async findAll(
    params?: QueryParams & PaginationParams,
    config?: AxiosRequestConfig,
  ): Promise<T[] | PaginatedResult<T>> {
    return apiClient.get<T[] | PaginatedResult<T>>(`${this.endpoint}`, {
      params,
      ...config,
    });
  }

  /**
   * Find one record by ID
   */
  async findOne(id: string | number, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.get<T>(`${this.endpoint}/${id}`, config);
  }

  /**
   * Find one record by custom query
   */
  async findOneBy(
    params: QueryParams,
    config?: AxiosRequestConfig,
  ): Promise<T | null> {
    return apiClient.get<T | null>(`${this.endpoint}/find`, {
      params,
      ...config,
    });
  }

  /**
   * Update a record
   */
  async update(
    id: string | number,
    data: Partial<T>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return apiClient.put<T>(`${this.endpoint}/${id}`, data, config);
  }

  /**
   * Update many records (if backend supports)
   */
  async updateMany(
    where: QueryParams,
    data: Partial<T>,
    config?: AxiosRequestConfig,
  ): Promise<{ count: number }> {
    return apiClient.patch<{ count: number }>(
      `${this.endpoint}/bulk`,
      { where, data },
      config,
    );
  }

  /**
   * Delete a record (soft delete if backend supports)
   */
  async remove(id: string | number, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.delete<T>(`${this.endpoint}/${id}`, config);
  }

  /**
   * Hard delete a record (if backend supports)
   */
  async hardRemove(
    id: string | number,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return apiClient.delete<T>(`${this.endpoint}/${id}/hard`, config);
  }

  /**
   * Delete many records (if backend supports)
   */
  async removeMany(
    where: QueryParams,
    config?: AxiosRequestConfig,
  ): Promise<{ count: number }> {
    return apiClient.delete<{ count: number }>(`${this.endpoint}/bulk`, {
      data: { where },
      ...config,
    });
  }

  /**
   * Check if record exists
   */
  async exists(
    where: QueryParams,
    config?: AxiosRequestConfig,
  ): Promise<boolean> {
    const response = await apiClient.get<{ exists: boolean }>(
      `${this.endpoint}/exists`,
      {
        params: where,
        ...config,
      },
    );
    return response.exists;
  }

  /**
   * Count records
   */
  async count(
    where?: QueryParams,
    config?: AxiosRequestConfig,
  ): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      `${this.endpoint}/count`,
      {
        params: where,
        ...config,
      },
    );
    return response.count;
  }

  /**
   * Batch create records (if backend supports)
   */
  async createMany(
    data: Partial<T>[],
    skipDuplicates = false,
    config?: AxiosRequestConfig,
  ): Promise<{ count: number }> {
    return apiClient.post<{ count: number }>(
      `${this.endpoint}/bulk`,
      { data, skipDuplicates },
      config,
    );
  }

  /**
   * Custom endpoint call
   */
  async custom<R = any>(
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const url = `${this.endpoint}${path}`;

    switch (method) {
      case "GET":
        return apiClient.get<R>(url, {
          ...config,
          params: data,
        });
      case "POST":
        return apiClient.post<R>(url, data, config);
      case "PUT":
        return apiClient.put<R>(url, data, config);
      case "PATCH":
        return apiClient.patch<R>(url, data, config);
      case "DELETE":
        return apiClient.delete<R>(url, {
          data,
          ...config,
        });
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
}
