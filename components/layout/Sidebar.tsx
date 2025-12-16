"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  ShoppingBag,
  Calendar,
  Users,
  Plus,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: Home, label: "მაგალითი" },
    { href: "/feed", icon: Home, label: "სიახლეები" },
    { href: "/user", icon: Users, label: "ავტომოყვარულები" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/groups", icon: Users, label: "Groups" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r-4 border-stone-800 bg-[#1a1918]  sticky  overflow-y-auto top-0 h-screen">
      {/* Decorative Header Plate */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 text-stone-500 mb-4 opacity-50">
          <Wrench size={14} />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
            Navigation System
          </span>
        </div>
      </div>

      <div className="px-4 space-y-3 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link key={link.href} href={link.href}>
              <button
                className={cn(
                  "relative w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 group border-l-4",
                  // Active State: Amber glow, lighter background
                  isActive
                    ? "bg-stone-800 text-amber-500 border-amber-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                    : "border-transparent text-stone-400 hover:text-[#EBE9E1] hover:bg-stone-800/50 hover:border-stone-600"
                )}
              >
                {/* Active Indicator Light (Little dot) */}
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                )}

                <Icon
                  className={cn(
                    "mr-4 transition-transform duration-300 group-hover:scale-110",
                    isActive
                      ? "text-amber-500"
                      : "text-stone-600 group-hover:text-stone-300"
                  )}
                  size={18}
                />

                <span className="font-mono">{link.label}</span>
              </button>
            </Link>
          );
        })}
      </div>

      {/* Bottom Action Area (Sticky at bottom of sidebar) */}
      <div className="p-6 border-t-4 border-stone-800 bg-[#151413]">
        {/* Decorative "Caution" Stripes */}
        <div className="h-2 w-full mb-4 bg-[repeating-linear-gradient(45deg,#292524,#292524_10px,#1c1917_10px,#1c1917_20px)] border border-stone-700 opacity-50" />

        <Link href="/cars/create">
          <button
            className="
            w-full group relative flex items-center justify-center 
            px-4 py-4 bg-[#EBE9E1] text-stone-900 
            font-black uppercase tracking-widest text-xs
            border-2 border-transparent
            shadow-[4px_4px_0px_0px_#b45309] 
            hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#b45309]
            hover:bg-white
            active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
            transition-all duration-150
          "
          >
            <Plus
              className="mr-2 text-amber-700 group-hover:rotate-90 transition-transform duration-300"
              size={18}
              strokeWidth={3}
            />
            <span>Add Vehicle</span>

            {/* Corner Screws for the button */}
            <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-stone-400" />
            <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-stone-400" />
            <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-stone-400" />
            <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-stone-400" />
          </button>
        </Link>

        <div className="mt-4 text-center">
          <span className="text-[9px] text-stone-600 font-mono uppercase">
            VINTAGE MOTORS © 2024
          </span>
        </div>
      </div>
    </aside>
  );
}
