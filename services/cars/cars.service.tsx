import { apiClient } from "@/lib/api";
import { BaseApiService } from "@/services/common/base-api.service";
import { PaginationParams } from "@/types/pagination.types";
import { MediaDto } from "@/services/media.service";

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

  photos?: MediaDto[];
  coverPhoto?: MediaDto | null;

  description?: string;
  nickname?: string;

  isProject?: boolean;
  isPublic?: boolean;
  garageId?: string | null;

  createdAt: string;
  updatedAt: string;
}

class CarsService extends BaseApiService<Car> {
  protected endpoint = "/cars";

  getTrending(limit = 20) {
    return apiClient.get(`/trending?limit=${limit}`);
  }

  search(params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/search`, params);
  }

  getUserGarage(userId: string, params: PaginationParams) {
    return apiClient.get(`${this.endpoint}/garage/${userId}`, params);
  }

  like(id: string) {
    return apiClient.post(`${this.endpoint}/${id}/like`);
  }

  getCarDetails(carId: string, options?: { headers?: HeadersInit }) {
    return apiClient.get(`/cars/${carId}`, undefined, options);
  }

  delete(carId: string) {
    return apiClient.delete(`/cars/${carId}`);
  }
}

export const carsService = new CarsService();
