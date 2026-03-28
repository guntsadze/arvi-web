import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials: true, // ✅ HttpOnly Cookie ავტომატურად იგზავნება
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;

        // ფუნქცია, რომელიც გამოიძახებს მოდალს
        const triggerAuthModal = () => {
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            window.dispatchEvent(
              new CustomEvent("AUTH_REQUIRED", {
                detail: { returnTo: currentPath },
              }),
            );
          }
        };

        // 1. თუ refresh-ზე მოვიდა 401 — სესია მკვდარია
        if (
          error.response?.status === 401 &&
          originalRequest.url?.includes("/auth/refresh")
        ) {
          triggerAuthModal(); // ლოგინის ნაცვლად ვაღებთ მოდალს
          return Promise.reject(error);
        }

        // 2. სხვა endpoint-ზე 401
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await this.client.post("/auth/refresh");

            this.failedQueue.forEach(({ resolve, config }) => {
              resolve(this.client(config));
            });
            this.failedQueue = [];
            this.isRefreshing = false; // არ დაგავიწყდეს flag-ის ჩამოყრა

            return this.client(originalRequest);
          } catch (refreshError) {
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            this.isRefreshing = false;

            triggerAuthModal(); // აქაც მოდალი
            return Promise.reject(refreshError);
          }
        }

        // შეცდომის ფორმატირება (როგორც გქონდა)
        const status = error.response?.status;
        const data = error.response?.data;
        const message = data?.message || error.message;

        const formattedError = new Error(`${status}: ${message}`) as any;
        formattedError.data = data;
        formattedError.status = status;
        return Promise.reject(formattedError);
      },
    );
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
    body?: any,
    options?: { headers?: AxiosRequestConfig["headers"] },
  ): Promise<T> {
    return this.client.delete(path, {
      data: body,
      headers: options?.headers,
    });
  }

  patch<T = any>(
    path: string,
    body?: any,
    options?: { headers?: AxiosRequestConfig["headers"] },
  ): Promise<T> {
    return this.client.patch(path, body, {
      headers: options?.headers,
    });
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013",
);
