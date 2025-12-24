import { apiClient } from "@/lib/api-client";
import { BaseApiService } from "@/services/common/base-api.service";

export interface Car {
  id: string;

  make: string;
  model: string;
  year: number;

  vin?: string;
  licensePlate?: string;

  engine?: string;
  horsepower?: number;
  torque?: number;

  fuelType:
    | "PETROL"
    | "DIESEL"
    | "ELECTRIC"
    | "HYBRID"
    | "PLUGIN_HYBRID"
    | "LPG"
    | "CNG"
    | "HYDROGEN";

  transmission: "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC" | "CVT" | "DCT";
  driveType?: "FWD" | "RWD" | "AWD" | "FOURWD";

  color?: string;
  mileage?: number;
  bodyType?: string;

  images?: string[];
  coverImage?: string;

  description?: string;
  nickname?: string;

  isProject?: boolean;
  isPublic?: boolean;

  createdAt: string;
  updatedAt: string;
}

class CarsService extends BaseApiService<Car> {
  protected endpoint = "/cars";

  getTrending(limit = 20) {
    return apiClient.get(`/trending?limit=${limit}`);
  }

  search(page = 1, limit = 20) {
    return apiClient.get(`${this.endpoint}/search?page=${page}&limit=${limit}`);
  }

  getUserGarage(userId: string, page = 1, limit = 10) {
    return apiClient.get(
      `${this.endpoint}/garage/${userId}?page=${page}&limit=${limit}`
    );
  }

  toggleLike(id: string) {
    return apiClient.post(`/cars/${id}/like`, {});
  }
}

export const carsService = new CarsService();
