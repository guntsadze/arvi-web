"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Calendar,
  Users,
  Wrench,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User as UserIcon,
  Bell,
  MapPin,
  Tag,
  Car,
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useCars } from "@/hooks/useCars";
import { GlobalSearchBar } from "./GlobalSearchBar";
import { authService } from "@/services/auth/auth.services";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { ProfileDropdown } from "../right-panel/dropdowns/ProfileDropdown";
import { DropdownPortal } from "../right-panel/DropdownPortal";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsDropdown } from "../right-panel/dropdowns/NotificationsDropdown";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { CarAvatarItem } from "../ui/CarAvatarItem";
import { groupsService } from "@/services/groups.service";
import { GroupAvatarItem } from "../ui/GroupAvatarItem";
import { marketplaceService } from "@/services/marketplace.service";
import { usePresence } from "@/context/PresenceContext";
import Image from "next/image";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// ────────────────────────────────────────────────────────────────
// MINI LISTING CARD
// ────────────────────────────────────────────────────────────────
const MiniListingCard = ({ listing }: { listing: any }) => {
  const car = listing.car;
  const photo = car?.photos?.[0]?.url;

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group flex items-center gap-3 px-3 py-2.5 border-l-2 border-transparent hover:border-amber-500 hover:bg-stone-800/30 transition-all cursor-pointer">
        {/* Thumbnail */}
        <div className="w-10 h-10 shrink-0 bg-stone-900 border border-stone-800 overflow-hidden group-hover:border-stone-600 transition-colors">
          {photo ? (
            <Image
              src={photo}
              alt={car?.model ?? "Car"}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car size={16} className="text-stone-700" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] font-mono font-bold text-stone-300 truncate uppercase tracking-wide group-hover:text-amber-500 transition-colors">
              {car?.year} {car?.make} {car?.model}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-mono font-black text-amber-500">
              {listing.price > 0
                ? `${listing.price.toLocaleString()} ${listing.currency}`
                : "Call"}
            </span>
            {listing.location && (
              <span className="flex items-center gap-0.5 text-[8px] font-mono text-stone-600 truncate">
                <MapPin size={8} />
                {listing.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ────────────────────────────────────────────────────────────────
// MINI GROUP ROW (extracted for reuse)
// ────────────────────────────────────────────────────────────────
const MiniGroupRow = ({
  group,
  isActive,
}: {
  group: any;
  isActive: boolean;
}) => (
  <Link href={`/groups/${group.slug}`}>
    <button
      className={cn(
        "relative w-full flex items-center px-3 py-2.5 text-xs font-bold transition-all duration-200 group border-l-2",
        isActive
          ? "bg-stone-800/50 text-amber-500 border-amber-500"
          : "border-transparent text-stone-500 hover:text-stone-300 hover:bg-stone-800/30 hover:border-stone-700",
      )}
    >
      <div className="w-6 h-6 bg-stone-900 border border-stone-800 flex items-center justify-center mr-3 overflow-hidden transition-colors group-hover:border-stone-600">
        <GroupAvatarItem group={group} size="sm" />
      </div>
      <span className="font-mono truncate uppercase tracking-wider">
        {group.name}
      </span>
      {isActive && (
        <div className="ml-auto w-1 h-1 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]" />
      )}
    </button>
  </Link>
);

// ────────────────────────────────────────────────────────────────
// SIDEBAR BOTTOM PANEL (Nodes / Market tabs)
// ────────────────────────────────────────────────────────────────
const BottomPanel = ({
  myGroups,
  groupsLoading,
  listings,
  listingsLoading,
  pathname,
}: {
  myGroups: any[];
  groupsLoading: boolean;
  listings: any[];
  listingsLoading: boolean;
  pathname: string;
}) => {
  const [tab, setTab] = useState<"nodes" | "market">("nodes");

  return (
    <div className="flex flex-col border-t-4 border-stone-800 bg-[#151413] flex-1 min-h-0">
      {/* Tab bar */}
      <div className="flex border-b border-stone-800 shrink-0">
        <button
          onClick={() => setTab("nodes")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-mono font-black uppercase tracking-widest transition-all border-b-2",
            tab === "nodes"
              ? "text-amber-500 border-amber-500 bg-amber-500/5"
              : "text-stone-600 border-transparent hover:text-stone-400",
          )}
        >
          <Users size={11} />
          Nodes
        </button>
        <div className="w-px bg-stone-800" />
        <button
          onClick={() => setTab("market")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-mono font-black uppercase tracking-widest transition-all border-b-2",
            tab === "market"
              ? "text-amber-500 border-amber-500 bg-amber-500/5"
              : "text-stone-600 border-transparent hover:text-stone-400",
          )}
        >
          <Tag size={11} />
          Market
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {tab === "nodes" && (
          <>
            <div className="px-4 py-2 flex items-center justify-between sticky top-0 bg-[#151413] z-10 border-b border-stone-800/40">
              <span className="text-[8px] font-mono text-stone-600 uppercase tracking-[0.3em]">
                Active_Nodes
              </span>

              <Link
                href="/groups"
                className="group/link flex items-center gap-1 text-[9px] font-mono font-bold text-stone-600 hover:text-amber-500 transition-colors uppercase tracking-tighter"
              >
                <span>Explore</span>
                <div className="w-3 h-3 border border-stone-800 flex items-center justify-center group-hover/link:border-amber-500 group-hover/link:bg-amber-500 group-hover/link:text-stone-900 transition-all">
                  <ChevronRight size={10} />
                </div>
              </Link>
            </div>

            {groupsLoading ? (
              <div className="animate-pulse space-y-3 p-4">
                <div className="h-4 bg-stone-800 rounded w-3/4" />
                <div className="h-4 bg-stone-800 rounded w-1/2" />
                <div className="h-4 bg-stone-800 rounded w-2/3" />
              </div>
            ) : myGroups.length > 0 ? (
              <div className="py-1">
                {myGroups.map((group) => (
                  <MiniGroupRow
                    key={group.id}
                    group={group}
                    isActive={pathname === `/groups/${group.slug}`}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 m-3 border border-dashed border-stone-800 text-center">
                <p className="text-[9px] font-mono text-stone-700 uppercase">
                  // No_Nodes_Joined
                </p>
              </div>
            )}
          </>
        )}

        {tab === "market" && (
          <>
            <div className="px-4 py-2 flex items-center justify-between sticky top-0 bg-[#151413] z-10 border-b border-stone-800/40">
              <span className="text-[8px] font-mono text-stone-600 uppercase tracking-[0.3em]">
                Latest_Listings
              </span>
              {/* <Link
                href="/marketplace"
                className="text-[8px] font-mono text-amber-700 hover:text-amber-500 transition-colors"
              >
                View All →
              </Link> */}
              <Link
                href="/marketplace"
                className="group/link flex items-center gap-1 text-[9px] font-mono font-bold text-stone-600 hover:text-amber-500 transition-colors uppercase tracking-tighter"
              >
                <span>View All</span>
                <div className="w-3 h-3 border border-stone-800 flex items-center justify-center group-hover/link:border-amber-500 group-hover/link:bg-amber-500 group-hover/link:text-stone-900 transition-all">
                  <ChevronRight size={10} />
                </div>
              </Link>
            </div>

            {listingsLoading ? (
              <div className="animate-pulse space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-stone-800 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-stone-800 rounded w-3/4" />
                      <div className="h-2.5 bg-stone-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="py-1">
                {listings.map((listing) => (
                  <MiniListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="p-4 m-3 border border-dashed border-stone-800 text-center">
                <p className="text-[9px] font-mono text-stone-700 uppercase">
                  // No_Active_Listings
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// MAIN SIDEBAR
// ────────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showUsers, setShowUsers] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const { isUserOnline } = usePresence();

  const currentUser = useAppSelector(selectCurrentUser);
  const links = [
    { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/groups", icon: Users, label: "Groups" },
  ];

  const { users } = useUsers();
  const { cars } = useCars();

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    removeNotification,
    handleNotificationClick,
  } = useNotifications();

  const currentItems = showUsers ? users : cars;
  const filteredUsers = users.filter((u) => u.id !== currentUser?.id);
  const maxIndex = Math.max(0, currentItems.length - 4);

  // Groups data
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  // Listings data
  const [listings, setListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    groupsService
      .getGroups(1, 15)
      .then((res) => {
        const data = res.data?.data || res.data || res;
        setMyGroups(data);
      })
      .catch((err) => console.error("FAILED_TO_LOAD_NODES", err))
      .finally(() => setGroupsLoading(false));
  }, []);

  useEffect(() => {
    marketplaceService
      .searchListings(1, {})
      .then((res) => {
        const data = res.data?.data || res.data || res;
        setListings(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("FAILED_TO_LOAD_LISTINGS", err))
      .finally(() => setListingsLoading(false));
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (e: React.MouseEvent, type: string) => {
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, right: 16 });
      setActiveDropdown(type);
    }
  };

  const SidebarContent = () => (
    <>
      {/* ── TOP: Logo + Nav + Search ── */}
      <div className="p-6 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <Link href="/feed" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  fill
                  className="-rotate-12"
                />
              </div>

              <div className="absolute inset-0 bg-amber-500/20 blur-lg -z-10" />
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {links.slice(0, 4).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={cn(
                    "p-2 rounded-md transition-all duration-200 relative",
                    isActive
                      ? "bg-amber-500 text-stone-900 shadow-lg"
                      : "text-stone-500 hover:text-amber-500 hover:bg-stone-800/50",
                  )}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,1)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <GlobalSearchBar />
      </div>

      {/* ── BOTTOM: Nodes / Market tabs ── */}
      <BottomPanel
        myGroups={myGroups}
        groupsLoading={groupsLoading}
        listings={listings}
        listingsLoading={listingsLoading}
        pathname={pathname}
      />

      {/* ── MIDDLE: Featured carousel ── */}
      <div className="px-4 py-4 border-y border-stone-800 bg-[#151413] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-amber-500" />
          </div>

          <div className="flex items-center gap-3">
            {/* View All Minimalist Link */}
            <Link
              href={showUsers ? "/user" : "/cars"}
              className="group/link flex items-center gap-1 text-[9px] font-mono font-bold text-stone-600 hover:text-amber-500 transition-colors uppercase tracking-tighter"
            >
              <span>View All</span>
              <div className="w-3 h-3 border border-stone-800 flex items-center justify-center group-hover/link:border-amber-500 group-hover/link:bg-amber-500 group-hover/link:text-stone-900 transition-all">
                <ChevronRight size={10} />
              </div>
            </Link>

            {/* Vertical Divider */}
            <div className="w-[1px] h-3 bg-stone-800" />

            {/* Toggles */}
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setShowUsers(true);
                  setCarouselIndex(0);
                }}
                className={cn(
                  "px-2 py-1 text-[9px] font-bold uppercase transition-all border border-transparent",
                  showUsers
                    ? "bg-amber-500 text-stone-900 shadow-[2px_2px_0px_0px_#78350f]"
                    : "bg-stone-800 text-stone-500 hover:text-amber-500 border-stone-700",
                )}
              >
                Users
              </button>
              <button
                onClick={() => {
                  setShowUsers(false);
                  setCarouselIndex(0);
                }}
                className={cn(
                  "px-2 py-1 text-[9px] font-bold uppercase transition-all border border-transparent",
                  !showUsers
                    ? "bg-amber-500 text-stone-900 shadow-[2px_2px_0px_0px_#78350f]"
                    : "bg-stone-800 text-stone-500 hover:text-amber-500 border-stone-700",
                )}
              >
                Cars
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out gap-2"
            style={{ transform: `translateX(-${carouselIndex * 68}px)` }}
          >
            {showUsers
              ? filteredUsers.map((user) => (
                  <UserAvatarItem
                    key={user.id}
                    user={user}
                    isOnline={isUserOnline(user.id)}
                  />
                ))
              : cars.map((car) => <CarAvatarItem key={car.id} car={car} />)}
          </div>
        </div>

        {currentItems.length > 4 && (
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={() => setCarouselIndex((p) => Math.max(p - 1, 0))}
              disabled={carouselIndex === 0}
              className="p-1 bg-stone-800 text-stone-500 hover:text-amber-500 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={() => setCarouselIndex((p) => Math.min(p + 1, maxIndex))}
              disabled={carouselIndex >= maxIndex}
              className="p-1 bg-stone-800 text-stone-500 hover:text-amber-500 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="p-2 border-t-4 border-stone-800 bg-[#151413] shrink-0">
        <span className="text-[9px] text-stone-600 font-mono uppercase">
          VINTAGE MOTORS © 2026
        </span>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a1918]/80 backdrop-blur-md border-b-2 border-stone-800 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-stone-900 border border-stone-700 text-amber-500 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all"
        >
          <Menu size={20} />
        </button>

        <span className="text-amber-500 font-black italic tracking-tighter text-lg">
          ARVI
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => toggleDropdown(e, "notifications")}
            className={cn(
              "relative p-2.5 rounded-sm border-2 transition-all",
              activeDropdown === "notifications"
                ? "bg-amber-500 text-stone-900 border-amber-500"
                : "bg-stone-900 border-stone-800 text-stone-500 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]",
            )}
          >
            <Bell size={18} strokeWidth={2.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#1a1918]">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={(e) => toggleDropdown(e, "profile")}
            className={cn(
              "w-10 h-10 rounded-sm border-2 overflow-hidden transition-all",
              activeDropdown === "profile"
                ? "border-amber-500 scale-95"
                : "border-stone-800 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]",
            )}
          >
            {/* {currentUser?.avatar?.url ? (
              <img
                src={currentUser.avatar.url}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500">
                <UserIcon size={18} />
              </div>
            )} */}
            <UserAvatarItem
              key={currentUser?.id}
              user={currentUser}
              size="sm"
              showName={false}
              disableLink={true}
            />
          </button>
        </div>
      </div>

      {activeDropdown && (
        <DropdownPortal
          pos={dropdownPos}
          onClose={() => setActiveDropdown(null)}
        >
          {activeDropdown === "notifications" && (
            <div className="w-[calc(100vw-32px)] max-w-[360px]">
              <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onRead={handleNotificationClick}
                onReadAll={markAllAsRead}
                onRemove={removeNotification}
              />
            </div>
          )}

          {activeDropdown === "profile" && currentUser && (
            <ProfileDropdown
              user={currentUser}
              onLogout={() => authService.logout()}
            />
          )}
        </DropdownPortal>
      )}

      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer (Sidebar) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-[#1a1918] border-r-4 border-stone-800 z-[70] lg:hidden flex flex-col transition-transform duration-300 ease-in-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-stone-500 hover:text-amber-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="pt-4 flex-1 flex flex-col overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r-4 border-stone-800 bg-[#1a1918] sticky top-0 h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}
