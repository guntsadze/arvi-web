import { apiClient } from "@/lib/api";
import { setUser, clearUser } from "@/store/slices/userSlice";
import { store } from "@/store/store";
import { User } from "@/types/messaging.types";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: User; // ✅ დაემატა
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    const user = response?.user;
    console.log("🚀 ~ AuthService ~ login ~ user:", user);

    if (user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    const user = response?.user;

    if (user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    store.dispatch(clearUser());
    window.location.href = "/login";
  }

  async refreshToken(): Promise<void> {
    await apiClient.post("/auth/refresh");
  }

  async getMe() {
    const response = await apiClient.get<{ user: User }>("/auth/me");
    return response.user;
  }

  redirectToGoogle() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  redirectToApple() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/apple`;
  }
}

export const authService = new AuthService();
