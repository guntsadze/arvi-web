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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/groups", icon: Users, label: "Groups" },
  ];

  return (
    <aside className="hidden lg:block w-64 border-r bg-white h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                )}
              >
                <Icon className="mr-3" size={20} />
                {link.label}
              </Button>
            </Link>
          );
        })}

        <div className="pt-4 border-t">
          <Link href="/cars/create">
            <Button className="w-full">
              <Plus className="mr-2" size={20} />
              ავტომობილის დამატება
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
