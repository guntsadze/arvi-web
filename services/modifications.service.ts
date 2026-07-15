import { apiClient } from "@/lib/api";

export interface Modification {
  id: string;
  carId: string;
  type: string;
  name: string;
  brand?: string | null;
  description?: string | null;
  cost?: number | null;
  installDate?: string | null;
  installedBy?: string | null;
  images: string[];
  hpGain?: number | null;
  torqueGain?: number | null;
  weightChange?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModificationInput {
  type: string;
  name: string;
  brand?: string;
  description?: string;
  cost?: number;
  installDate?: string;
  installedBy?: string;
  hpGain?: number;
  torqueGain?: number;
  weightChange?: number;
}

export const modificationsService = {
  getForCar(carId: string) {
    return apiClient.get<Modification[]>(`/modifications/car/${carId}`);
  },
  create(carId: string, data: CreateModificationInput) {
    return apiClient.post<Modification>(`/modifications/car/${carId}`, data);
  },
  update(id: string, data: Partial<CreateModificationInput>) {
    return apiClient.put<Modification>(`/modifications/${id}`, data);
  },
  remove(id: string) {
    return apiClient.delete<void>(`/modifications/${id}`);
  },
};
