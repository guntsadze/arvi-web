import { cookies } from "next/headers";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions extends RequestInit {
  body?: any;
  query?: Record<string, string | number | boolean>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // შეგიძლია environment variable-ით შეცვალო

function buildUrl(
  path: string,
  query?: Record<string, string | number | boolean>
) {
  const url = new URL(path, BASE_URL);
  if (query) {
    Object.entries(query).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  }
  return url.toString();
}

async function request(
  path: string,
  method: RequestMethod = "GET",
  options: ApiOptions = {}
) {
  const token = (await cookies()).get("token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
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

// Shortcuts
export const api = {
  get: (path: string, options?: ApiOptions) => request(path, "GET", options),
  post: (path: string, body?: any, options?: ApiOptions) =>
    request(path, "POST", { ...options, body }),
  put: (path: string, body?: any, options?: ApiOptions) =>
    request(path, "PUT", { ...options, body }),
  delete: (path: string, options?: ApiOptions) =>
    request(path, "DELETE", options),
};
