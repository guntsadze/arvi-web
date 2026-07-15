import { apiClient } from "@/lib/api";
import type { GarageDoorType, GarageMaterial, GarageSummary } from "@/types/user";

export interface CreateGarageInput {
  name?: string;
  doorType?: GarageDoorType;
  material?: GarageMaterial;
  color?: string;
}

export const garageService = {
  create(dto: CreateGarageInput) {
    return apiClient.post<GarageSummary>("/garages", dto);
  },
};
