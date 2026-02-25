import { apiClient } from "@/lib/api";
import { BaseApiService } from "@/services/common/base-api.service";
import { Marketplace, MarketplaceInput } from "@/types/groups.types";

class MarketplaceService extends BaseApiService<Marketplace> {
  protected endpoint = "/marketplace";

  createListing(data: MarketplaceInput) {
    return apiClient.post(this.endpoint, data);
  }

  getFeatured() {
    return apiClient.get(`${this.endpoint}/featured`);
  }

  searchListings(page: number, filters: any, limit: number = 10) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== ""),
      ),
    }).toString();

    return apiClient.get(`${this.endpoint}/search?${queryParams}`);
  }

  getListingById(id: string) {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  updateListing(id: string, data: MarketplaceInput) {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  deleteListing(id: string) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const marketplaceService = new MarketplaceService();
