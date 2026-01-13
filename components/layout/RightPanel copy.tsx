"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // დავამატეთ portal
import {
  Bell,
  MessageCircle,
  User,
  Radio,
  Trophy,
  Circle,
  Settings,
  LogOut,
  UserCircle,
  Clock,
  Mail,
  UserPlus,
  Heart,
  MessageSquare,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useConversations } from "@/hooks/useConversations";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { openChat } from "@/store/slices/floatingChatsSlice";
import { useDispatch } from "react-redux";
import { authService } from "@/services/auth/auth.services";
import { useNotifications } from "@/hooks/useNotifications";

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

type DropdownType = "notifications" | "messages" | "profile" | null;

export const RightPanel = () => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 }); // პოზიციის სთეითი

  const dispatch = useDispatch();

  const { notifications, unreadCount, markAsRead, removeNotification } =
    useNotifications();

  console.log("Notifications in RightPanel:", notifications);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector(selectCurrentUser);
  const { conversations, loading } = useConversations();

  // დროის ფორმატირების პატარა ფუნქცია
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // აიქონის შერჩევა ტიპის მიხედვით
  const getNotifIcon = (type: string) => {
    switch (type) {
      case "FOLLOW":
        return <UserPlus size={12} className="text-blue-400" />;
      case "LIKE":
        return <Heart size={12} className="text-red-400" />;
      case "COMMENT":
        return <MessageSquare size={12} className="text-green-400" />;
      default:
        return <Bell size={12} className="text-amber-400" />;
    }
  };

  // კლიკზე დახურვა
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // თუ დავაჭირეთ კონტეინერის გარეთ, ვხურავთ (dropdown თავად portal-შია, ამიტომ სიფრთხილეა საჭირო)
      if (
        activeDropdown &&
        !(event.target as HTMLElement).closest(".portal-dropdown-content")
      ) {
        // აქ დავამატე შემოწმება, რომ თავად ღილაკზე კლიკმა არ დახუროს მომენტალურად
        if (!(event.target as HTMLElement).closest(".dropdown-trigger")) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: DropdownType
  ) => {
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      // ვითვლით პოზიციას: ღილაკის ქვევით და მარჯვენა მხარეს გასწორებული
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
      setActiveDropdown(type);
    }
  };

  const getOtherParticipant = (conversation: any) => {
    return (
      conversation.participants?.find((p: any) => p.user.id !== currentUser?.id)
        ?.user || null
    );
  };

  const handleOpenChat = (conversation: any) => {
    const otherUser = getOtherParticipant(conversation);
    if (!otherUser) return;

    dispatch(
      openChat({
        id: conversation.id,
        conversationId: conversation.id,
        user: {
          id: otherUser.id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          username: otherUser.username,
          avatar: otherUser.avatar,
          isVerified: otherUser.isVerified,
        },
        isMinimized: false,
      })
    );
  };

  // --- Dropdown კომპონენტები Portal-ისთვის ---

  const DropdownContainer = ({ children }: { children: React.ReactNode }) => {
    if (typeof window === "undefined") return null;
    return createPortal(
      <div
        className="portal-dropdown-content fixed z-[9999] animate-in fade-in zoom-in duration-200"
        style={{ top: dropdownPos.top, right: dropdownPos.right }}
      >
        <div className="w-80 bg-[#1c1917] border-2 border-stone-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
          {children}
        </div>
      </div>,
      document.body
    );
  };

  if (loading) {
    return (
      <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800 items-center justify-center">
        <p className="text-stone-500 text-sm animate-pulse">INITIALIZING...</p>
      </aside>
    );
  }

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800">
      {/* Header */}
      <div
        className="bg-[#1c1917] border-b-4 border-stone-800 p-4 relative"
        ref={containerRef}
      >
        <div className="flex items-center justify-end gap-2">
          {/* Notifications */}
          <button
            onClick={(e) => toggleDropdown(e, "notifications")}
            className={cn(
              "dropdown-trigger p-2.5 rounded-full transition-all relative",
              activeDropdown === "notifications"
                ? "bg-amber-500 text-stone-900"
                : "bg-stone-800 text-stone-400 hover:text-amber-500"
            )}
          >
            <Bell size={20} strokeWidth={2.5} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#151413]">
                {unreadCount}
              </div>
            )}
          </button>

          {/* Messages */}
          <button
            onClick={(e) => toggleDropdown(e, "messages")}
            className={cn(
              "dropdown-trigger p-2.5 rounded-full transition-all relative",
              activeDropdown === "messages"
                ? "bg-amber-500 text-stone-900"
                : "bg-stone-800 text-stone-400 hover:text-amber-500"
            )}
          >
            <MessageCircle size={20} strokeWidth={2.5} />
          </button>

          {/* Profile */}
          <button
            onClick={(e) => toggleDropdown(e, "profile")}
            className={cn(
              "dropdown-trigger p-2.5 rounded-full transition-all relative overflow-hidden",
              activeDropdown === "profile"
                ? "bg-amber-500 ring-2 ring-amber-500"
                : "bg-stone-800 text-stone-400"
            )}
          >
            {currentUser?.avatar?.url ? (
              <img
                src={currentUser.avatar.url}
                className="w-5 h-5 object-cover rounded-full"
                alt="avatar"
              />
            ) : (
              <User size={20} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* --- PORTALS --- */}

      {/* --- NOTIFICATIONS PORTAL --- */}
      {activeDropdown === "notifications" && (
        <DropdownContainer>
          <div className="p-3 border-b-2 border-stone-800 bg-stone-900/80 backdrop-blur-md flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-amber-500" />
              <h3 className="font-black uppercase text-[10px] tracking-tighter text-stone-200">
                Incoming Signals ({unreadCount})
              </h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-[9px] text-amber-500 uppercase font-black hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                <CheckCheck size={12} /> Mark All
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto custom-scrollbar bg-[#1c1917]">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-[10px] font-mono text-stone-600 uppercase italic">
                  No signals detected
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={cn(
                    "group relative p-3 border-b border-stone-800 transition-all duration-200 cursor-pointer flex gap-3",
                    !notif.isRead
                      ? "bg-amber-500/5 hover:bg-amber-500/10"
                      : "hover:bg-stone-800/40"
                  )}
                >
                  {/* Avatar & Icon Overlay */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 border-2 border-stone-800 overflow-hidden bg-stone-900">
                      {notif.sender?.avatar ? (
                        <img
                          src={notif.sender.avatar}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-700">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1c1917] border border-stone-800 rounded-full flex items-center justify-center shadow-lg">
                      {getNotifIcon(notif.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-[11px] leading-tight text-stone-300">
                        <span className="font-black text-amber-500 uppercase mr-1">
                          {notif.sender?.username || "System"}
                        </span>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      )}
                    </div>

                    {notif.message && (
                      <p className="text-[10px] text-stone-500 line-clamp-1 italic mb-1">
                        "{notif.message}"
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock size={10} className="text-stone-600" />
                      <span className="text-[9px] font-mono text-stone-600">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Delete on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-stone-600 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <button className="w-full p-2.5 text-center text-[10px] font-black text-stone-500 bg-stone-900/50 border-t border-stone-800 hover:text-amber-500 transition-colors uppercase tracking-widest">
            View All Logs
          </button>
        </DropdownContainer>
      )}

      {activeDropdown === "messages" && (
        <DropdownContainer>
          <div className="p-3 border-b-2 border-stone-800 bg-stone-900/50">
            <h3 className="font-black uppercase text-xs text-stone-300">
              Messages
            </h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-stone-600 text-xs italic font-mono">
                NO ACTIVE FREQUENCIES
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleOpenChat(conv)}
                    className="p-3 border-b border-stone-800 hover:bg-stone-800/50 cursor-pointer flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-200 truncate">
                        {other?.username}
                      </h4>
                      <p className="text-[10px] text-stone-500 truncate">
                        {conv.messages?.[0]?.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <a
            href="/messages"
            className="p-3 text-center text-xs font-bold text-amber-500 bg-stone-900/50 hover:bg-stone-800"
          >
            VIEW ALL
          </a>
        </DropdownContainer>
      )}

      {activeDropdown === "profile" && currentUser && (
        <DropdownContainer>
          <div className="p-4 border-b-2 border-stone-800 bg-stone-900/50">
            <h4 className="font-black text-sm text-stone-200 uppercase">
              {currentUser.firstName}
            </h4>
            <p className="text-xs text-amber-500 font-mono">
              @{currentUser.username}
            </p>
          </div>
          {/* Menu Items */}
          <div className="py-2">
            <a
              href={`/profile/${currentUser.username}`}
              className="px-4 py-2.5 flex items-center gap-3 hover:bg-stone-800/50 transition-all group"
            >
              <UserCircle
                size={18}
                className="text-stone-500 group-hover:text-amber-500"
              />
              <span className="text-xs font-bold uppercase text-stone-300 group-hover:text-amber-500">
                Your Profile
              </span>
            </a>

            <a
              href="/settings"
              className="px-4 py-2.5 flex items-center gap-3 hover:bg-stone-800/50 transition-all group"
            >
              <Settings
                size={18}
                className="text-stone-500 group-hover:text-amber-500"
              />
              <span className="text-xs font-bold uppercase text-stone-300 group-hover:text-amber-500">
                Settings
              </span>
            </a>

            <div className="h-[2px] bg-stone-800 my-2" />

            <button
              onClick={() => {
                authService.logout();
                console.log("Logout");
              }}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-900/20 transition-all group"
            >
              <LogOut
                size={18}
                className="text-stone-500 group-hover:text-red-500"
              />
              <span className="text-xs font-bold uppercase text-stone-300 group-hover:text-red-500">
                Logout
              </span>
            </button>
          </div>
        </DropdownContainer>
      )}

      {/* Main Content (Active Frequencies) */}
      <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
        <div className="flex flex-col gap-3">
          <h3 className="font-black uppercase text-[10px] tracking-widest text-stone-500 flex items-center gap-2">
            <Radio size={14} className="text-amber-500" /> Active Frequencies
          </h3>

          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleOpenChat(conv)}
                className="bg-[#1c1917] border-2 border-stone-800 p-3 hover:border-amber-600 transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-[10px] font-black text-stone-200 uppercase group-hover:text-amber-500 transition-colors">
                    {getOtherParticipant(conv)?.username}
                  </h4>
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      getOtherParticipant(conv)?.online
                        ? "bg-green-500"
                        : "bg-stone-700"
                    )}
                  />
                </div>
                <p className="text-[9px] font-mono text-stone-500 truncate italic">
                  {conv.messages?.[0]?.content || "SIGNAL LOST..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
