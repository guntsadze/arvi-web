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
        formattedError.config = originalRequest;
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

  /**
   * multipart/form-data POST (file uploads). The instance sets a default
   * `Content-Type: application/json` header — that has to be cleared, not
   * just omitted, or axios keeps it instead of letting the browser set the
   * multipart boundary itself, and the server can't parse the body.
   */
  postForm<T = any>(
    path: string,
    formData: FormData,
    onUploadProgress?: (percent: number) => void,
  ): Promise<T> {
    return this.client.post(path, formData, {
      headers: { "Content-Type": undefined },
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(e.total ? Math.round((e.loaded / e.total) * 100) : 0)
        : undefined,
    });
  }

  /**
   * Registers an extra response-error observer without altering anything
   * setupInterceptors already does (auth refresh, error reformatting into
   * `{ message, data, status, config }` above all still run exactly as
   * before — this callback never swallows the rejection, only re-throws
   * it unchanged). Axios runs response interceptors in *registration*
   * order (each interceptor is pushed, not unshifted — see
   * axios/lib/core/Axios.js), so an observer registered here — always
   * after the constructor's own interceptor, since that one is wired up
   * at construction time — sees the already-reformatted `{ message, data,
   * status, config }` error, not the raw AxiosError. Consume it as that
   * shape (`config` was added above specifically so callers can scope by
   * request URL/method).
   * Used by the onboarding wizard (app/(onboarding)/onboarding/garage/page.tsx)
   * to map class-validator's raw `message: string[]` onto wizard steps;
   * callers should unsubscribe (e.g. on unmount) using the returned function.
   */
  onResponseError(handler: (error: unknown) => void): () => void {
    const id = this.client.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        handler(error);
        return Promise.reject(error);
      },
    );
    return () => this.client.interceptors.response.eject(id);
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013",
);
