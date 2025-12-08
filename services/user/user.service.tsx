import { BaseApiService } from "../common/base-api.service";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

class UserService extends BaseApiService<User> {
  protected endpoint = "/users";

  // Custom method specific to users
  async updateProfile(data: Partial<User>): Promise<User> {
    return this.custom<User>("/profile", "PATCH", data);
  }

  // Custom method: Get users by role
  async getByRole(role: string): Promise<User[]> {
    return this.findAll({ role }) as Promise<User[]>;
  }

  // Custom method: Search users
  async search(query: string): Promise<User[]> {
    return this.custom<User[]>("/search", "GET", { q: query });
  }
}

export const userService = new UserService();
