import { UserCircle, Settings, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  user: any;
  onLogout: () => void;
}

export const ProfileDropdown = ({ user, onLogout }: ProfileDropdownProps) => {
  return (
    <>
      <div className="p-4 border-b-2 border-stone-800 bg-stone-900/50">
        <h4 className="font-black text-sm text-stone-200 uppercase leading-none mb-1">
          {user.firstName} {user.lastName}
        </h4>
        <p className="text-[10px] text-amber-500 font-mono tracking-tighter">
          @{user.username}
        </p>
      </div>

      <div className="py-1">
        <ProfileLink
          href={`/profile/${user.username}`}
          icon={<UserCircle size={16} />}
          label="Your Profile"
        />
        <ProfileLink
          href="/settings"
          icon={<Settings size={16} />}
          label="Settings"
        />

        <div className="h-[2px] bg-stone-800 my-1" />

        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-900/20 transition-all group"
        >
          <LogOut
            size={16}
            className="text-stone-500 group-hover:text-red-500"
          />
          <span className="text-[11px] font-black uppercase text-stone-300 group-hover:text-red-500">
            Disconnect
          </span>
        </button>
      </div>
    </>
  );
};

const ProfileLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) => (
  <a
    href={href}
    className="px-4 py-2.5 flex items-center gap-3 hover:bg-stone-800 transition-all group"
  >
    <span className="text-stone-500 group-hover:text-amber-500 transition-colors">
      {icon}
    </span>
    <span className="text-[11px] font-black uppercase text-stone-300 group-hover:text-amber-500 transition-colors">
      {label}
    </span>
  </a>
);
