import { apiClient } from "@/lib/api";
import { clearUser } from "@/store/slices/userSlice";
import { store } from "@/store/store";
import { User } from "@/types/messaging.types";

export interface RequestOtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
  isNewUser: boolean;
  wasRestored: boolean;
}

class AuthService {
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    store.dispatch(clearUser());
    window.location.href = "/login";
  }

  async refreshToken(): Promise<void> {
    await apiClient.post("/auth/refresh");
  }

  async getMe(): Promise<User> {
    const response = await apiClient.get<{ user: User }>("/auth/me");
    return response.user;
  }

  redirectToGoogle(): void {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  async requestOtp(phone: string): Promise<RequestOtpResponse> {
    return apiClient.post<RequestOtpResponse>("/auth/phone/request-otp", {
      phone,
    });
  }

  async verifyOtp(phone: string, code: string): Promise<VerifyOtpResponse> {
    return apiClient.post<VerifyOtpResponse>("/auth/phone/verify-otp", {
      phone,
      code,
    });
  }
}

export const authService = new AuthService();
