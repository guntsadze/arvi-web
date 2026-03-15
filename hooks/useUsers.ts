import { useState, useEffect, useCallback } from "react";
import { usersService } from "@/services/user/user.service";
import { User } from "@/types/user";

export const useUsers = (page = 1, pageSize = 50) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await usersService.findAll({ page, limit: pageSize });

      console.log("Full API Response:", res);

      let usersArray: User[] = [];

      // მონაცემების სტრუქტურის შემოწმება (შენი არსებული ლოგიკით)
      if (res.data && res.data.data) {
        usersArray = res.data.data;
      } else if (Array.isArray(res.data)) {
        usersArray = res.data;
      } else if (res.data) {
        usersArray = res.data;
      }

      // ვალიდაცია: მხოლოდ ის იუზერები, რომლებსაც აქვთ username
      const validUsers = usersArray.filter((user) => user.username !== null);

      setUsers(validUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};
