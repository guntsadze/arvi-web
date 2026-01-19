"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  ShoppingBag,
  Calendar,
  Users,
  Wrench,
  Car,
  Menu,
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  User as UserIcon,
  Bell,
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

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showUsers, setShowUsers] = useState(true);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const currentUser = useAppSelector(selectCurrentUser);

  const links = [
    // { href: "/user", icon: Users, label: "ავტომოყვარულები" },
    // { href: "/cars", icon: Car, label: "ავტომობილები" },
    // { href: "/messages", icon: MessageCircle, label: "მესიჯები" },
    // { href: "/explore", icon: Compass, label: "Explore" },
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
  const maxIndex = Math.max(0, currentItems.length - 4);

  const nextSlide = () => {
    setCarouselIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (e: React.MouseEvent, type: string) => {
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: 16, // მობილურზე ყოველთვის მარჯვენა კიდესთან იყოს
      });
      setActiveDropdown(type);
    }
  };

  // Sidebar კომპონენტის შიგნით
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const res = await groupsService.getGroups(1, 15);
        const data = res.data?.data || res.data || res;
        setMyGroups(data);
      } catch (err) {
        console.error("FAILED_TO_LOAD_NODES", err);
      } finally {
        setGroupsLoading(false);
      }
    };
    fetchMyGroups();
  }, []);

  const SidebarContent = () => (
    <>
      <div className="p-6 pb-4">
        {/* Logo & Quick Nav Icons */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <Wrench size={18} className="text-stone-900 -rotate-12" />
              </div>
              <div className="absolute inset-0 bg-amber-500/20 blur-lg -z-10" />
            </div>
          </Link>

          {/* Quick Navigation Icons */}
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

        {/* Search Bar */}
        <div className="mt-4">
          <GlobalSearchBar />
        </div>
      </div>

      {/* --- ჩანაცვლებული ნაწილი: MY_GROUPS_LIST --- */}
      <div className="px-4 mb-2 flex items-center justify-between">
        <span className="text-[10px] font-mono text-stone-600 uppercase tracking-[0.3em]">
          Active_Nodes
        </span>
        <Link
          href="/groups"
          className="text-[9px] font-mono text-amber-700 hover:underline"
        >
          EXPLORE
        </Link>
      </div>

      <div className="px-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        {groupsLoading ? (
          // Skeleton loader ან მარტივი ტექსტი
          <div className="animate-pulse space-y-3 p-4">
            <div className="h-4 bg-stone-800 rounded w-3/4" />
            <div className="h-4 bg-stone-800 rounded w-1/2" />
          </div>
        ) : myGroups.length > 0 ? (
          myGroups.map((group) => {
            const isActive = pathname === `/groups/${group.slug}`;

            return (
              <Link key={group.id} href={`/groups/${group.slug}`}>
                <button
                  className={cn(
                    "relative w-full flex items-center px-3 py-2.5 text-xs font-bold transition-all duration-200 group border-l-2",
                    isActive
                      ? "bg-stone-800/50 text-amber-500 border-amber-500"
                      : "border-transparent text-stone-500 hover:text-stone-300 hover:bg-stone-800/30 hover:border-stone-700",
                  )}
                >
                  {/* Group Avatar Mini */}
                  <div className="w-6 h-6 bg-stone-900 border border-stone-800 flex items-center justify-center mr-3 overflow-hidden transition-colors group-hover:border-stone-600">
                    {group.avatar ? (
                      <img
                        src={group.avatar}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100"
                      />
                    ) : (
                      <Users size={12} className="text-stone-700" />
                    )}
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
          })
        ) : (
          <div className="p-4 border border-dashed border-stone-800 text-center">
            <p className="text-[10px] font-mono text-stone-700 uppercase">
              // No_Nodes_Joined
            </p>
          </div>
        )}
      </div>

      {/* Featured Section - Bottom Left */}
      <div className="px-4 py-4 border-t-4 border-stone-800 bg-[#151413] min-h-[190px]">
        {/* Section Header with Toggle */}
        <div className="flex items-center justify-between mb-4">
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

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Viewport */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out gap-2"
              style={{
                transform: `translateX(-${carouselIndex * 68}px)`,
              }}
            >
              {showUsers
                ? users.map((user) => (
                    <UserAvatarItem key={user.id} user={user} />
                  ))
                : cars.map((car) => <CarAvatarItem key={car.id} car={car} />)}
            </div>
          </div>

          {/* Carousel Controls */}
          {currentItems.length > 4 && (
            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={prevSlide}
                disabled={carouselIndex === 0}
                className="p-1 bg-stone-800 text-stone-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                onClick={nextSlide}
                disabled={carouselIndex >= maxIndex}
                className="p-1 bg-stone-800 text-stone-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-2 border-t-4 border-stone-800 bg-[#151413]">
        <span className="text-[9px] text-stone-600 font-mono uppercase">
          VINTAGE MOTORS © 2026
        </span>
      </div>
    </>
  );

  return (
    <>
      {/* --- MOBILE HEADER (Top Bar) --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a1918]/80 backdrop-blur-md border-b-2 border-stone-800 z-50 flex items-center justify-between px-4">
        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-stone-900 border border-stone-700 text-amber-500 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Logo or Title in center (Optional) */}
        <span className="text-amber-500 font-black italic tracking-tighter text-lg">
          ARVI
        </span>

        <div className="flex items-center gap-3">
          {/* Notifications Button */}
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

          {/* Profile Button */}
          <button
            onClick={(e) => toggleDropdown(e, "profile")}
            className={cn(
              "w-10 h-10 rounded-sm border-2 overflow-hidden transition-all",
              activeDropdown === "profile"
                ? "border-amber-500 scale-95"
                : "border-stone-800 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]",
            )}
          >
            {currentUser?.avatar?.url ? (
              <img
                src={currentUser.avatar.url}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500">
                <UserIcon size={18} />
              </div>
            )}
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
              {" "}
              {/* მობილურზე სიგანის კონტროლი */}
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
