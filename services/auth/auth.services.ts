// import { apiClient } from "@/lib/api";
// import Cookie from "js-cookie";

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterData {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
// }

// export interface AuthResponse {
//   user: {
//     id: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     avatar?: string;
//     role?: string;
//   };
// }

// class AuthService {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     const response = await apiClient.post("/auth/login", credentials);

//     const token = response?.token;
//     const user = response?.user;

//     if (user && typeof window !== "undefined") {
//       localStorage.setItem("user", JSON.stringify(user));
//     }

//     if (token && typeof document !== "undefined") {
//       Cookie.set("token", token);
//     }

//     return response;
//   }

//   async register(data: RegisterData): Promise<AuthResponse> {
//     const response = await apiClient.post("/auth/register", data);

//     const token = response?.token;
//     const user = response?.user;

//     if (user && typeof window !== "undefined") {
//       localStorage.setItem("user", JSON.stringify(user));
//     }

//     if (token && typeof document !== "undefined") {
//       Cookie.set("token", token);
//     }

//     return response;
//   }

//   async getProfile() {
//     const response = await apiClient.get("/auth/profile");
//     return response.data;
//   }

//   logout() {
//     localStorage.removeItem("user");
//     Cookie.remove("token");
//     window.location.href = "/login";
//   }

//   getStoredUser() {
//     if (typeof window === "undefined") return null;
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   }

//   // OAuth URLs
//   getGoogleAuthUrl() {
//     return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
//   }

//   getAppleAuthUrl() {
//     return `${process.env.NEXT_PUBLIC_API_URL}/auth/apple`;
//   }
// }

// export const authService = new AuthService();

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

    store.dispatch(setUser(response.user)); // ✅ Redux-ში შენახვა
    if (user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    const user = response?.user;

    store.dispatch(setUser(response.user)); // ✅ Redux-ში შენახვა
    if (user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    store.dispatch(clearUser()); // ✅ Redux გასუფთავება
    window.location.href = "/login";
  }

  async refreshToken(): Promise<void> {
    await apiClient.post("/auth/refresh");
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ user: User }>("/auth/profile");
    store.dispatch(setUser(response.user)); // ✅ profile განახლება
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
