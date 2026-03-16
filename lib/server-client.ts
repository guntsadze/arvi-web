import { cookies } from "next/headers";

export async function serverGet<T>(path: string): Promise<T> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013"}${path}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (response.status === 401) {
    throw new Error("401: Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}
