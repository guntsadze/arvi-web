import { apiClient } from "@/lib/api";

export interface MaintenanceRecord {
  id: string;
  carId: string;
  type: string;
  title: string;
  description?: string | null;
  mileage?: number | null;
  cost?: number | null;
  serviceDate?: string | null;
  servicedBy?: string | null;
  location?: string | null;
  nextServiceDue?: string | null;
  nextServiceMileage?: number | null;
  images: string[];
  receipt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceInput {
  type: string;
  title: string;
  description?: string;
  mileage?: number;
  cost?: number;
  serviceDate?: string;
  servicedBy?: string;
  location?: string;
  nextServiceDue?: string;
  nextServiceMileage?: number;
}

export const maintenanceService = {
  getForCar(carId: string) {
    return apiClient.get<MaintenanceRecord[]>(`/maintenance/car/${carId}`);
  },
  create(carId: string, data: CreateMaintenanceInput) {
    return apiClient.post<MaintenanceRecord>(`/maintenance/car/${carId}`, data);
  },
  update(id: string, data: Partial<CreateMaintenanceInput>) {
    return apiClient.put<MaintenanceRecord>(`/maintenance/${id}`, data);
  },
  remove(id: string) {
    return apiClient.delete<void>(`/maintenance/${id}`);
  },
};
