import { apiClient } from "@/lib/api-client";

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
    role: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", credentials);
    this.setAuth(response.data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/register", data);
    this.setAuth(response.data);
    return response.data;
  }

  async getProfile() {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  }

  setAuth(data: AuthResponse) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  logout() {
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
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
