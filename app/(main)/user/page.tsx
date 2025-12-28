"use client";

import { Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { usersService } from "@/services/user/user.service";
import { User } from "@/types/user";
import UserCard from "@/components/user/UserCard";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await usersService.findAll({ page: 1, pageSize: 50 });

        console.log("Full API Response:", res);

        let usersArray: User[] = [];
        if (res.data && res.data.data) {
          usersArray = res.data.data;
        } else if (Array.isArray(res.data)) {
          usersArray = res.data;
        } else if (res.data) {
          usersArray = res.data;
        }

        const validUsers = usersArray.filter((user) => user.username !== null);
        setUsers(validUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:20px_20px] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-stone-500 font-mono py-20">
          INITIALIZING DATABASE...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:20px_20px] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-red-500 font-mono py-20">
          ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:20px_20px] py-12 px-4">
      <div className="max-w-7xl mx-auto mb-10 border-b-4 border-double border-stone-700 pb-4">
        <h1 className="text-3xl md:text-5xl font-black text-[#dcd8c8] uppercase tracking-tighter flex items-center gap-4">
          <Hash className="text-amber-600" size={40} />
          Personnel Database
        </h1>
        <p className="text-stone-500 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
          Secure Archive • Authorized Access Only
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <div className="col-span-full text-center text-stone-500 font-mono py-20">
            NO PERSONNEL RECORDS FOUND IN DATABASE.
          </div>
        )}
      </div>
    </div>
  );
}
