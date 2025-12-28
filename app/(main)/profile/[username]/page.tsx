import FollowButton from "@/components/profile/FollowButton";
import ImageUploader from "@/components/ui/ImageUploader";
import { usersService } from "@/services/user/user.service";
import { MapPin, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import MessageButton from "./MessageButton";
import ProfileContentWrapper from "./UserProfileContent";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { username } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const user = await usersService.getByUsername(username, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(user);

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500/30">
      {/* Carbon Fiber Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Profile Header Area */}
      <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
        {/* COVER PHOTO SECTION */}
        <div className="absolute top-6 right-6 z-30">
          <ImageUploader userId={user.id} type="cover" />
        </div>

        {user.coverPhoto ? (
          <Image
            src={user.coverPhoto?.url}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-[#0a0a0a]" />
        )}

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

        {/* Identity Section */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-10 pb-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
            {/* AVATAR SECTION */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 relative">
                <div className="absolute inset-0 bg-orange-500 rotate-3 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-full h-full rounded-2xl border-4 border-orange-500 overflow-hidden bg-neutral-900 shadow-2xl">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                  {/* Avatar Upload Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <ImageUploader userId={user.id} type="avatar" />
                  </div>
                </div>
                {user.showOnlineStatus && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#0a0a0a] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] z-20" />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                  {user.firstName} {user.lastName}
                </h1>
                {user.isVerified && (
                  <ShieldCheck className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-neutral-400 font-mono text-sm">
                <span className="text-orange-500 font-bold">
                  @{user.username}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {user.location || "Earth"}
                </span>
                <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] border border-neutral-700 uppercase tracking-widest text-white">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto pb-2">
              <FollowButton
                userId={user.id}
                initialFollowing={user.isFollowing || false}
                followersCount={user.followersCount || 0}
                // onFollowersChange={(newCount) => {
                //   // თუ გინდა რომ StatCard-ში followers რიცხვი მაშინვე განახლდეს (optimistic update)
                //   // შეგიძლია state გამოიყენო parent-ში, მაგრამ მარტივად რომ იყოს – უბრალოდ დატოვე
                // }}
              />
              <MessageButton userId={user.id} />
            </div>
          </div>
        </div>
      </div>

      {/* ძველი Dashboard Grid-ის ნაცვლად ვიძახებთ ახალ კომპონენტს */}
      <ProfileContentWrapper user={user} userId={user.id} />
    </div>
  );
}
