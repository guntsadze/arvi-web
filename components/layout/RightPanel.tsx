"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, MessageCircle, User } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useConversations } from "@/hooks/useConversations";
import { useNotifications } from "@/hooks/useNotifications";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { openChat } from "@/store/slices/floatingChatsSlice";
import { authService } from "@/services/auth/auth.services";
import { DropdownPortal } from "../right-panel/DropdownPortal";
import { NotificationsDropdown } from "../right-panel/dropdowns/NotificationsDropdown";
import { MessagesDropdown } from "../right-panel/dropdowns/MessagesDropdown";
import { ProfileDropdown } from "../right-panel/dropdowns/ProfileDropdown";
import { ActiveFrequencies } from "../right-panel/ActiveFrequencies";

export const RightPanel = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { conversations, loading } = useConversations();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    handleNotificationClick,
  } = useNotifications();

  // --- Handlers ---
  const toggleDropdown = (e: React.MouseEvent, type: string) => {
    if (activeDropdown === type) setActiveDropdown(null);
    else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
      setActiveDropdown(type);
    }
  };

  const getOtherParticipant = useCallback(
    (conv: any) =>
      conv.participants?.find((p: any) => p.user.id !== currentUser?.id)
        ?.user || null,
    [currentUser]
  );

  const handleOpenChat = (conv: any) => {
    const other = getOtherParticipant(conv);
    if (!other) return;
    dispatch(
      openChat({
        id: conv.id,
        conversationId: conv.id,
        user: other,
        isMinimized: false,
      })
    );
    setActiveDropdown(null);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        activeDropdown &&
        !target.closest(".portal-dropdown-content") &&
        !target.closest(".dropdown-trigger")
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [activeDropdown]);

  if (loading) return <div className="...">INITIALIZING...</div>;

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800">
      {/* HEADER CONTROLS */}
      <div className="bg-[#1c1917] border-b-4 border-stone-800 p-4 flex justify-end gap-2">
        <HeaderButton
          active={activeDropdown === "notifications"}
          onClick={(e) => toggleDropdown(e, "notifications")}
          badge={unreadCount}
        >
          <Bell size={20} strokeWidth={2.5} />
        </HeaderButton>

        <HeaderButton
          active={activeDropdown === "messages"}
          onClick={(e) => toggleDropdown(e, "messages")}
        >
          <MessageCircle size={20} strokeWidth={2.5} />
        </HeaderButton>

        <button
          onClick={(e) => toggleDropdown(e, "profile")}
          className={`dropdown-trigger w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
            activeDropdown === "profile"
              ? "border-amber-500 scale-105"
              : "border-stone-800"
          }`}
        >
          {currentUser?.avatar?.url ? (
            <img
              src={currentUser.avatar.url}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500">
              <User size={20} />
            </div>
          )}
        </button>
      </div>

      {/* DROPDOWNS RENDERER */}
      {activeDropdown && (
        <DropdownPortal
          pos={dropdownPos}
          onClose={() => setActiveDropdown(null)}
        >
          {activeDropdown === "notifications" && (
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onRead={handleNotificationClick}
              onReadAll={markAllAsRead}
              onRemove={removeNotification}
            />
          )}

          {activeDropdown === "messages" && (
            <MessagesDropdown
              conversations={conversations}
              onOpenChat={handleOpenChat}
              getOtherParticipant={getOtherParticipant}
            />
          )}

          {activeDropdown === "profile" && currentUser && (
            <ProfileDropdown
              user={currentUser}
              onLogout={() => authService.logout()}
            />
          )}
        </DropdownPortal>
      )}

      {/* SIDEBAR MAIN CONTENT */}
      <ActiveFrequencies
        conversations={conversations}
        onOpenChat={handleOpenChat}
        getOtherParticipant={getOtherParticipant}
      />
    </aside>
  );
};

const HeaderButton = ({ children, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`dropdown-trigger p-2.5 rounded-full transition-all relative ${
      active
        ? "bg-amber-500 text-stone-900 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        : "bg-stone-800 text-stone-400 hover:text-amber-500 hover:bg-stone-700"
    }`}
  >
    {children}
    {badge > 0 && (
      <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#1c1917]">
        {badge}
      </div>
    )}
  </button>
);
