export class ClientApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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

    const response = await fetch(url.toString(), {
      method,
      credentials: "include", // <-- მთავარი ნაწილი! Cookie გაიგზავნება
      headers: {
        "Content-Type": "application/json",
      },
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

// Singleton instance
export const apiClient = new ClientApi(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013"
);
