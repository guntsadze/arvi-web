import { BaseApiService } from "@/services/common/base-api.service";

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

class UsersService extends BaseApiService<User> {
  protected endpoint = "/users";
}

export const usersService = new UsersService();
