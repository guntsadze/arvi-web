import { UserCircle, Settings, LogOut, PersonStanding } from "lucide-react";
import type { ReactNode } from "react";
import type { User } from "@/types/user";
import { getProfileHref, getSettingsHref } from "@/lib/utils";

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
}

export const ProfileDropdown = ({ user, onLogout }: ProfileDropdownProps) => {
  return (
    <>
      <div className="p-4 border-b-2 border-border bg-surface-1/50">
        <h4 className="font-black text-sm text-text-primary uppercase leading-none mb-1">
          {user.firstName} {user.lastName}
        </h4>
        <p className="text-[10px] text-accent font-mono tracking-tighter">
          {user.username ? `@${user.username}` : "პროფილი დაუსახელებელია"}
        </p>
      </div>

      <div className="py-1">
        <ProfileLink
          href={getProfileHref(user.username)}
          icon={<UserCircle size={16} />}
          label="პირადი გვერდი"
        />
        <ProfileLink
          href={getSettingsHref(user.username, "profile")}
          icon={<PersonStanding size={16} />}
          label="პროფილის ინფორმაცია"
        />
        <ProfileLink
          href={getSettingsHref(user.username, "account")}
          icon={<Settings size={16} />}
          label="პარამეტრები"
        />

        <div className="h-[2px] bg-surface-2 my-1" />

        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-error/10/20 transition-all group"
        >
          <LogOut
            size={16}
            className="text-text-secondary group-hover:text-error"
          />
          <span className="text-[11px] font-black uppercase text-text-secondary group-hover:text-error">
            გასვლა
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
  icon: ReactNode;
  label: string;
}) => (
  <a
    href={href}
    className="px-4 py-2.5 flex items-center gap-3 hover:bg-surface-1-hover transition-all group"
  >
    <span className="text-text-secondary group-hover:text-accent transition-colors">
      {icon}
    </span>
    <span className="text-[11px] font-black uppercase text-text-secondary group-hover:text-accent transition-colors">
      {label}
    </span>
  </a>
);
