import { usersService } from "@/services/user/user.service";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  MessageSquare,
  UserPlus,
  Clock,
  Trophy,
  Zap,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import ImageUploader from "@/components/ui/ImageUploader";
import { UserPosts } from "./UserPosts";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { username } = await params;
  const user = await usersService.getByUsername(username);

  if (!user) {
    notFound();
  }

  const joinDate = user.createdAt
    ? format(new Date(user.createdAt), "MMMM, yyyy", { locale: ka })
    : "უცნობია";

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
                    src={user.avatar?.url || "/default-avatar.png"}
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
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase italic tracking-tighter transition-all skew-x-[-12deg]">
                <span className="inline-block skew-x-[12deg] flex items-center gap-2">
                  <UserPlus size={18} /> Follow
                </span>
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 font-black uppercase italic tracking-tighter transition-all skew-x-[-12deg]">
                <span className="inline-block skew-x-[12deg]">
                  <MessageSquare size={18} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <StatCard
              label="Posts"
              value={user.postsCount || 0}
              icon={<Activity size={14} />}
            />
            <StatCard
              label="Followers"
              value={user.followersCount || 0}
              icon={<Trophy size={14} />}
            />
            <StatCard
              label="Following"
              value={user.followingCount || 0}
              icon={<Zap size={14} />}
            />
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
            <h3 className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500" /> Driver's Statement
            </h3>
            <p className="text-neutral-300 leading-relaxed font-light">
              {user.bio || "No telemetry data recorded for this driver."}
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between text-sm border-b border-neutral-800 pb-2">
              <span className="text-neutral-500 uppercase font-mono">
                Status
              </span>
              <span className="text-green-500 font-mono">Active</span>
            </div>
            <div className="flex items-center justify-between text-sm border-b border-neutral-800 pb-2">
              <span className="text-neutral-500 uppercase font-mono">
                Joined
              </span>
              <span className="text-neutral-200 font-mono">{joinDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 uppercase font-mono">
                System ID
              </span>
              <span className="text-neutral-600 font-mono text-[10px]">
                {user.id.slice(0, 15)}...
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-8 border-b border-neutral-800 mb-6 font-mono text-[10px] tracking-widest">
            <button className="pb-4 border-b-2 border-orange-500 text-white font-bold uppercase">
              Telemetry Feed
            </button>
            <button className="pb-4 text-neutral-500 uppercase">Garage</button>
            <button className="pb-4 text-neutral-500 uppercase">
              Achievements
            </button>
          </div>

          <div className="p-2">
            <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
              <UserPosts userId={user.id} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl hover:border-orange-500/50 transition-all group">
      <div className="flex items-center gap-2 text-neutral-500 mb-1 group-hover:text-orange-500 transition-colors">
        {icon}
        <span className="text-[10px] uppercase font-black tracking-tighter">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black italic tracking-tighter font-mono">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
