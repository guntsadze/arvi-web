import { apiClient } from "@/lib/api-client";
import { AxiosRequestConfig } from "axios";

export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryParams {
  [key: string]: any;
}

export abstract class BaseApiService<T> {
  protected abstract endpoint: string;

  /**
   * Create a new record
   */
  async create(data: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(`${this.endpoint}`, data, config);
    return response.data;
  }

  /**
   * Find all records with optional pagination and filters
   */
  async findAll(
    params?: QueryParams & PaginationParams,
    config?: AxiosRequestConfig
  ): Promise<T[] | PaginatedResult<T>> {
    const response = await apiClient.get<T[] | PaginatedResult<T>>(
      `${this.endpoint}`,
      {
        params,
        ...config,
      }
    );
    return response.data;
  }

  /**
   * Find one record by ID
   */
  async findOne(id: string | number, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(`${this.endpoint}/${id}`, config);
    return response.data;
  }

  /**
   * Find one record by custom query
   */
  async findOneBy(
    params: QueryParams,
    config?: AxiosRequestConfig
  ): Promise<T | null> {
    const response = await apiClient.get<T | null>(`${this.endpoint}/find`, {
      params,
      ...config,
    });
    return response.data;
  }

  /**
   * Update a record
   */
  async update(
    id: string | number,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.put<T>(
      `${this.endpoint}/${id}`,
      data,
      config
    );
    return response.data;
  }

  /**
   * Update many records (if backend supports)
   */
  async updateMany(
    where: QueryParams,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<{ count: number }> {
    const response = await apiClient.patch<{ count: number }>(
      `${this.endpoint}/bulk`,
      { where, data },
      config
    );
    return response.data;
  }

  /**
   * Delete a record (soft delete if backend supports)
   */
  async remove(id: string | number, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(
      `${this.endpoint}/${id}`,
      config
    );
    return response.data;
  }

  /**
   * Hard delete a record (if backend supports)
   */
  async hardRemove(
    id: string | number,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.delete<T>(
      `${this.endpoint}/${id}/hard`,
      config
    );
    return response.data;
  }

  /**
   * Delete many records (if backend supports)
   */
  async removeMany(
    where: QueryParams,
    config?: AxiosRequestConfig
  ): Promise<{ count: number }> {
    const response = await apiClient.delete<{ count: number }>(
      `${this.endpoint}/bulk`,
      {
        data: { where },
        ...config,
      }
    );
    return response.data;
  }

  /**
   * Check if record exists
   */
  async exists(
    where: QueryParams,
    config?: AxiosRequestConfig
  ): Promise<boolean> {
    const response = await apiClient.get<{ exists: boolean }>(
      `${this.endpoint}/exists`,
      {
        params: where,
        ...config,
      }
    );
    return response.data.exists;
  }

  /**
   * Count records
   */
  async count(
    where?: QueryParams,
    config?: AxiosRequestConfig
  ): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      `${this.endpoint}/count`,
      {
        params: where,
        ...config,
      }
    );
    return response.data.count;
  }

  /**
   * Batch create records (if backend supports)
   */
  async createMany(
    data: Partial<T>[],
    skipDuplicates = false,
    config?: AxiosRequestConfig
  ): Promise<{ count: number }> {
    const response = await apiClient.post<{ count: number }>(
      `${this.endpoint}/bulk`,
      { data, skipDuplicates },
      config
    );
    return response.data;
  }

  /**
   * Custom endpoint call
   */
  async custom<R = any>(
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const url = `${this.endpoint}${path}`;

    switch (method) {
      case "GET":
        const getResponse = await apiClient.get<R>(url, {
          ...config,
          params: data,
        });
        return getResponse.data;
      case "POST":
        const postResponse = await apiClient.post<R>(url, data, config);
        return postResponse.data;
      case "PUT":
        const putResponse = await apiClient.put<R>(url, data, config);
        return putResponse.data;
      case "PATCH":
        const patchResponse = await apiClient.patch<R>(url, data, config);
        return patchResponse.data;
      case "DELETE":
        const deleteResponse = await apiClient.delete<R>(url, {
          data,
          ...config,
        });
        return deleteResponse.data;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
}

// ============================================
// Example: Product Service
// ============================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

class ProductService extends BaseApiService<Product> {
  protected endpoint = "/products";

  // Custom method: Get products by category
  async getByCategory(
    categoryId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Product>> {
    return this.findAll({ categoryId, ...pagination }) as Promise<
      PaginatedResult<Product>
    >;
  }

  // Custom method: Update stock
  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.custom<Product>(`/${id}/stock`, "PATCH", { quantity });
  }

  // Custom method: Get featured products
  async getFeatured(): Promise<Product[]> {
    return this.custom<Product[]>("/featured", "GET");
  }
}

export const productService = new ProductService();

// ============================================
// Example: Order Service
// ============================================

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

class OrderService extends BaseApiService<Order> {
  protected endpoint = "/orders";

  // Custom method: Get user orders
  async getMyOrders(
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Order>> {
    return this.custom<PaginatedResult<Order>>("/my-orders", "GET", pagination);
  }

  // Custom method: Update order status
  async updateStatus(id: string, status: Order["status"]): Promise<Order> {
    return this.custom<Order>(`/${id}/status`, "PATCH", { status });
  }

  // Custom method: Cancel order
  async cancel(id: string, reason?: string): Promise<Order> {
    return this.custom<Order>(`/${id}/cancel`, "POST", { reason });
  }
}

export const orderService = new OrderService();
