export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match?.[2] || null;
  }

  private async request(
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    query?: Record<string, string | number | boolean>
  ) {
    const url = new URL(path, this.baseUrl);

    if (query) {
      Object.entries(query).forEach(([key, value]) =>
        url.searchParams.append(key, String(value))
      );
    }

    const token = this.getTokenFromCookie();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // თუ token არსებობს, დავამატოთ Authorization header
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method,
      credentials: "include",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error: ${response.status} - ${text}`);
    }

    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  get(path: string, query?: Record<string, string | number | boolean>) {
    return this.request(path, "GET", undefined, query);
  }

  post(path: string, body?: any) {
    return this.request(path, "POST", body);
  }

  put(path: string, body?: any) {
    return this.request(path, "PUT", body);
  }

  delete(path: string) {
    return this.request(path, "DELETE");
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013"
);
