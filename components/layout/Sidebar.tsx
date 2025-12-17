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
  Menu, // ჰამბურგერის აიქონი
  X, // დახურვის აიქონი
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth/auth.services";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // მენიუს სტატუსი

  // გვერდის შეცვლისას მენიუ ავტომატურად დაიხუროს
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // სქროლის გათიშვა როცა მენიუ ღიაა (UX-ისთვის)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const links = [
    { href: "/", icon: Car, label: "მთავარი" },
    { href: "/feed", icon: Home, label: "სიახლეები" },
    { href: "/user", icon: Users, label: "ავტომოყვარულები" },
    { href: "/cars/create", icon: Car, label: "ავტომობილები" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/groups", icon: Users, label: "Groups" },
  ];

  // ეს კომპონენტი გამოვიყენოთ როგორც დესკტოპზე, ისე მობილურზე (კოდის დუბლირების თავიდან ასაცილებლად)
  const SidebarContent = () => (
    <>
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 text-stone-500 mb-4 opacity-50">
          <Wrench size={14} />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
            Navigation System
          </span>
        </div>
      </div>

      <div className="px-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link key={link.href} href={link.href}>
              <button
                className={cn(
                  "relative w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 group border-l-4",
                  isActive
                    ? "bg-stone-800 text-amber-500 border-amber-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                    : "border-transparent text-stone-400 hover:text-[#EBE9E1] hover:bg-stone-800/50 hover:border-stone-600"
                )}
              >
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

      <div className="p-6 border-t-4 border-stone-800 bg-[#151413] space-y-4 mt-auto">
        <div className="h-2 w-full mb-4 bg-[repeating-linear-gradient(45deg,#292524,#292524_10px,#1c1917_10px,#1c1917_20px)] border border-stone-700 opacity-50" />

        <button
          onClick={() => authService.logout()}
          className="
            w-full group relative flex items-center justify-center
            px-4 py-4 bg-red-700 text-white
            font-black uppercase tracking-widest text-xs
            border-2 border-transparent
            shadow-[4px_4px_0px_0px_#7f1d1d]
            hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#7f1d1d]
            hover:bg-red-600
            active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
            transition-all duration-150
          "
        >
          <Wrench className="mr-2" size={16} strokeWidth={3} />
          <span>Logout</span>
        </button>

        <div className="mt-4 text-center">
          <span className="text-[9px] text-stone-600 font-mono uppercase">
            VINTAGE MOTORS © 2024
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 
        ---------- MOBILE HAMBURGER BUTTON ----------
        ჩანს მხოლოდ მობილურზე (lg:hidden) 
      */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1918] border-2 border-stone-700 text-amber-500 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
      >
        <Menu size={24} />
      </button>

      {/* 
        ---------- MOBILE OVERLAY & DRAWER ---------- 
      */}
      {/* Backdrop (შავი ფონი) */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-[#1a1918] border-r-4 border-stone-800 z-[70] lg:hidden flex flex-col transition-transform duration-300 ease-in-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button Inside Drawer */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-stone-500 hover:text-amber-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <SidebarContent />
      </aside>

      {/* 
        ---------- DESKTOP SIDEBAR ----------
        ჩანს მხოლოდ დიდ ეკრანებზე (hidden lg:flex)
      */}
      <aside className="hidden lg:flex flex-col w-72 border-r-4 border-stone-800 bg-[#1a1918] sticky top-0 h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Home,
//   Compass,
//   ShoppingBag,
//   Calendar,
//   Users,
//   Plus,
//   Wrench,
//   Car,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { authService } from "@/services/auth/auth.services";

// export function Sidebar() {
//   const pathname = usePathname();

//   const links = [
//     { href: "/", icon: Car, label: "მაგალითი" },
//     { href: "/feed", icon: Home, label: "სიახლეები" },
//     { href: "/user", icon: Users, label: "ავტომოყვარულები" },
//     { href: "/cars/create", icon: Car, label: "ავტომობილები" },
//     { href: "/explore", icon: Compass, label: "Explore" },
//     { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
//     { href: "/events", icon: Calendar, label: "Events" },
//     { href: "/groups", icon: Users, label: "Groups" },
//   ];

//   return (
//     <aside className="hidden lg:flex flex-col w-72 border-r-4 border-stone-800 bg-[#1a1918]  sticky  overflow-y-auto top-0 h-screen">
//       {/* Decorative Header Plate */}
//       <div className="p-6 pb-2">
//         <div className="flex items-center gap-2 text-stone-500 mb-4 opacity-50">
//           <Wrench size={14} />
//           <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
//             Navigation System
//           </span>
//         </div>
//       </div>

//       <div className="px-4 space-y-3 flex-1">
//         {links.map((link) => {
//           const Icon = link.icon;
//           const isActive = pathname === link.href;

//           return (
//             <Link key={link.href} href={link.href}>
//               <button
//                 className={cn(
//                   "relative w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 group border-l-4",
//                   // Active State: Amber glow, lighter background
//                   isActive
//                     ? "bg-stone-800 text-amber-500 border-amber-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
//                     : "border-transparent text-stone-400 hover:text-[#EBE9E1] hover:bg-stone-800/50 hover:border-stone-600"
//                 )}
//               >
//                 {/* Active Indicator Light (Little dot) */}
//                 {isActive && (
//                   <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]" />
//                 )}

//                 <Icon
//                   className={cn(
//                     "mr-4 transition-transform duration-300 group-hover:scale-110",
//                     isActive
//                       ? "text-amber-500"
//                       : "text-stone-600 group-hover:text-stone-300"
//                   )}
//                   size={18}
//                 />

//                 <span className="font-mono">{link.label}</span>
//               </button>
//             </Link>
//           );
//         })}
//       </div>

//       {/* Bottom Action Area (Sticky at bottom of sidebar) */}
//       <div className="p-6 border-t-4 border-stone-800 bg-[#151413] space-y-4">
//         {/* Decorative "Caution" Stripes */}
//         <div className="h-2 w-full mb-4 bg-[repeating-linear-gradient(45deg,#292524,#292524_10px,#1c1917_10px,#1c1917_20px)] border border-stone-700 opacity-50" />

//         {/* Logout Button */}
//         <button
//           onClick={() => authService.logout()}
//           className="
//       w-full group relative flex items-center justify-center
//       px-4 py-4 bg-red-700 text-white
//       font-black uppercase tracking-widest text-xs
//       border-2 border-transparent
//       shadow-[4px_4px_0px_0px_#7f1d1d]
//       hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#7f1d1d]
//       hover:bg-red-600
//       active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
//       transition-all duration-150
//     "
//         >
//           <Wrench className="mr-2" size={16} strokeWidth={3} />
//           <span>Logout</span>
//         </button>

//         <div className="mt-4 text-center">
//           <span className="text-[9px] text-stone-600 font-mono uppercase">
//             VINTAGE MOTORS © 2024
//           </span>
//         </div>
//       </div>
//     </aside>
//   );
// }
