
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

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

    // Request interceptor — token cookie-დან
    this.client.interceptors.request.use((config) => {
      const token = this.getTokenFromCookie();
      if (token && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor — error handling
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

// export class ApiClient {
//   private baseUrl: string;

//   constructor(baseUrl: string) {
//     this.baseUrl = baseUrl;
//   }

//   private getTokenFromCookie(): string | null {
//     if (typeof document === "undefined") return null;
//     const match = document.cookie.match(/(^| )token=([^;]+)/);
//     return match?.[2] || null;
//   }

//   private async request(
//     path: string,
//     method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
//     body?: any,
//     query?: Record<string, string | number | boolean>,
//     extraHeaders?: HeadersInit,
//   ) {
//     const url = new URL(path, this.baseUrl);

//     if (query) {
//       Object.entries(query).forEach(([key, value]) =>
//         url.searchParams.append(key, String(value)),
//       );
//     }

//     const headers: HeadersInit = {
//       "Content-Type": "application/json",
//       ...extraHeaders, // <-- გარედან მოწოდებული ჰედერები (მაგ. სერვერული ტოკენი)
//     };

//     // თუ კლიენტის მხარეს ვართ და ტოკენი გვაქვს ქუქიში, ავტომატურად ჩავამატოთ
//     // ოღონდ მხოლოდ მაშინ, თუ Authorization უკვე არ არის გამოგზავნილი
//     const clientToken = this.getTokenFromCookie();
//     if (clientToken && !headers.hasOwnProperty("Authorization")) {
//       (headers as any).Authorization = `Bearer ${clientToken}`;
//     }

//     const response = await fetch(url.toString(), {
//       method,
//       credentials: "include",
//       headers,
//       body: body ? JSON.stringify(body) : undefined,
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`API Error: ${response.status} - ${text}`);
//     }

//     try {
//       return await response.json();
//     } catch {
//       return null;
//     }
//   }

//   // ყველა მეთოდს დავამატოთ options პარამეტრი
//   get(
//     path: string,
//     query?: Record<string, string | number | boolean>,
//     options?: { headers?: HeadersInit },
//   ) {
//     return this.request(path, "GET", undefined, query, options?.headers);
//   }

//   post(path: string, body?: any, options?: { headers?: HeadersInit }) {
//     return this.request(path, "POST", body, undefined, options?.headers);
//   }

//   put(path: string, body?: any, options?: { headers?: HeadersInit }) {
//     return this.request(path, "PUT", body, undefined, options?.headers);
//   }

//   delete(path: string, options?: { headers?: HeadersInit }) {
//     return this.request(path, "DELETE", undefined, undefined, options?.headers);
//   }
// }

// export const apiClient = new ApiClient(
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013",
// );
