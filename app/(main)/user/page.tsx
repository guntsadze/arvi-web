"use client";

import UserCard from "@/components/user/UserCard";
import { usersService } from "@/services/user/user.service";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GlobalLoader } from "@/components/loaders/GlobalLoader";
import CircleLoader from "@/components/loaders/CircleLoader";

export default function Page() {
  const {
    data: users,
    loading,
    hasMore,
    refresh,
    error,
  } = useInfiniteScroll(
    (page) => usersService.findAll({ page, limit: 10 }),
    [],
  );

  if (loading && users.length === 0) {
    return <GlobalLoader />;
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
      {/* <div className="max-w-7xl mx-auto mb-10 border-b-4 border-double border-stone-700 pb-4">
        <h1 className="text-3xl md:text-5xl font-black text-[#dcd8c8] uppercase tracking-tighter flex items-center gap-4">
          <Hash className="text-amber-600" size={40} />
          Personnel Database
        </h1>
        <p className="text-stone-300 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
          Secure Archive • Authorized Access Only
        </p>
      </div> */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}

        {loading && <CircleLoader />}

        {!hasMore && users.length > 0 && (
          <div className="col-span-full text-center text-[#EBE9E1] font-mono py-10">
            მეტი ინფორმაცი არ არის.
          </div>
        )}
      </div>
    </div>
  );
}
