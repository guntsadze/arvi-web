import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookie from "js-cookie";

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = Cookie.get("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const status = error.response?.status;
        const message = error.response?.data || error.message;
        throw new Error(`API Error: ${status} - ${JSON.stringify(message)}`);
      },
    );
  }

  private getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match?.[2] || null;
  }

  get<T = any>(
    path: string,
    query?: Record<string, string | number | boolean>,
    options?: { headers?: AxiosRequestConfig["headers"] },
  ): Promise<T> {
    return this.client.get(path, {
      params: query,
      headers: options?.headers,
    });
  }

  post<T = any>(
    path: string,
    body?: any,
    options?: { headers?: AxiosRequestConfig["headers"] },
  ): Promise<T> {
    return this.client.post(path, body, {
      headers: options?.headers,
    });
  }

  put<T = any>(
    path: string,
    body?: any,
    options?: { headers?: AxiosRequestConfig["headers"] },
  ): Promise<T> {
    return this.client.put(path, body, {
      headers: options?.headers,
    });
  }

  delete<T = any>(
    path: string,
    options?: { headers?: AxiosRequestConfig["headers"] },
  ): Promise<T> {
    return this.client.delete(path, {
      headers: options?.headers,
    });
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013",
);
