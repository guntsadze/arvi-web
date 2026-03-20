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
    // ✅ Request interceptor — token არ გვჭირდება, Cookie ავტომატურია
    this.client.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    );

    // ✅ Response interceptor — 401-ზე refresh, შემდეგ retry
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;

        // refresh endpoint-ზე 401 — სესია ამოიწურა, login-ზე გადა
        if (
          error.response?.status === 401 &&
          originalRequest.url?.includes("/auth/refresh")
        ) {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        // სხვა endpoint-ზე 401 — refresh სცადე
        if (error.response?.status === 401 && !originalRequest._retry) {
          // თუ უკვე refresh მიმდინარეობს, დაელოდე
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

            // ✅ რიგში მდგომი request-ები გაგზავნე
            this.failedQueue.forEach(({ resolve, config }) => {
              resolve(this.client(config));
            });
            this.failedQueue = [];

            return this.client(originalRequest);
          } catch {
            // refresh-იც ჩაიშალა — ყველა request უარყავი
            this.failedQueue.forEach(({ reject }) => reject(error));
            this.failedQueue = [];

            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(error);
          } finally {
            this.isRefreshing = false;
          }
        }

        // ✅ error ფორმატირება
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        return Promise.reject(new Error(`${status}: ${message}`));
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
