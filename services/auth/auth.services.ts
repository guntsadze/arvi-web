import { apiClient } from "@/lib/api-client";
import Cookie from "js-cookie";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", credentials);

    const token = response.data?.token;
    const user = response.data?.user;

    if (user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }

    if (token && typeof document !== "undefined") {
      Cookie.set("token", token);
    }

    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/register", data);

    const token = response.data?.token;
    const user = response.data?.user;

    if (user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }

    if (token && typeof document !== "undefined") {
      Cookie.set("token", token);
    }
    return response.data;
  }

  async getProfile() {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
    Cookie.remove("token");
    window.location.href = "/login";
  }

  getStoredUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // OAuth URLs
  getGoogleAuthUrl() {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  getFacebookAuthUrl() {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  }

  getAppleAuthUrl() {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/apple`;
  }
}

export const authService = new AuthService();
