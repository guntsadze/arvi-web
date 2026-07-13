/**
 * lib/api.ts's response interceptor rejects with a plain `Error` that has
 * `.data` (the raw response body) and `.status` attached to it — not an
 * AxiosError. This pulls the backend's `message` field off that shape,
 * falling back to a caller-provided default when it isn't present.
 */
interface ApiErrorShape {
  data?: { message?: string };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const shaped = error as Error & ApiErrorShape;
    const dataMessage = shaped.data?.message;
    if (typeof dataMessage === "string" && dataMessage.length > 0) {
      return dataMessage;
    }
    return error.message || fallback;
  }
  return fallback;
}
