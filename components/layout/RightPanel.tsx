"use client";

import { useState, useCallback } from "react";
import {
  Bell,
  MessageCircle,
  User as UserIcon,
  X,
  Activity,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useConversations } from "@/hooks/useConversations";
import { useNotifications } from "@/hooks/useNotifications";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { openChat } from "@/store/slices/floatingChatsSlice";
import { authService } from "@/services/auth/auth.services";

// კომპონენტები
import { NotificationsDropdown } from "../right-panel/dropdowns/NotificationsDropdown";
import { MessagesDropdown } from "../right-panel/dropdowns/MessagesDropdown";
import { ProfileDropdown } from "../right-panel/dropdowns/ProfileDropdown";
import { ActiveFrequencies } from "../right-panel/ActiveFrequencies";
import { UserAvatarItem } from "../ui/UserAvatarItem";
import { GlobalLoader } from "../loaders/GlobalLoader";

export const RightPanel = () => {
  const [activeView, setActiveView] = useState<
    "notifications" | "messages" | "profile"
  >("messages");

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  console.log("🚀 ~ RightPanel ~ currentUser:", currentUser);
  const { conversations, loading } = useConversations();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    removeNotification,
    handleNotificationClick,
  } = useNotifications();

  const handleViewChange = (view: typeof activeView) => {
    if (activeView === view && view !== "messages") setActiveView("messages");
    else setActiveView(view);
  };

  const getOtherParticipant = useCallback(
    (conv: any) =>
      conv.participants?.find((p: any) => p.user.id !== currentUser?.id)
        ?.user || null,
    [currentUser],
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
      }),
    );
  };

  // if (loading) return <GlobalLoader />;

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-surface-1">
      {/* HEADER */}
      <div className="bg-surface-1 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className={`w-1 h-3 shrink-0 ${activeView === "messages" ? "bg-accent animate-pulse" : "bg-surface-2"}`}
          />
          {/* <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest truncate">
            {activeView === "messages"
              ? "Frequencies_Active"
              : `${activeView}_Module`}
          </span> */}
        </div>

        <div className="flex gap-2">
          <HeaderButton
            active={activeView === "notifications"}
            onClick={() => handleViewChange("notifications")}
            badge={unreadCount}
          >
            <Bell size={18} strokeWidth={2.5} />
          </HeaderButton>

          <HeaderButton
            active={activeView === "messages"}
            onClick={() => handleViewChange("messages")}
          >
            <MessageCircle size={18} strokeWidth={2.5} />
          </HeaderButton>

          <button
            onClick={() => handleViewChange("profile")}
            className={`w-9 h-9 rounded-sm overflow-hidden border-2 transition-all ${
              activeView === "profile"
                ? "border-accent scale-105"
                : "border-border grayscale"
            }`}
          >
            {/* {currentUser?.avatar?.url ? (
              <img
                src={currentUser.avatar.url}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-2 flex items-center justify-center text-text-secondary">
                <UserIcon size={16} />
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

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-0">
        {" "}
        {/* min-h-0 არის კრიტიკული სქროლისთვის */}
        {/* Module Close Bar */}
        {/* {activeView !== "messages" && (
          <button
            onClick={() => setActiveView("messages")}
            className="w-full bg-accent/10 hover:bg-accent/20 text-[8px] font-mono text-accent py-1.5 border-b border-border flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
          >
            <X size={10} /> Exit_Current_Module
          </button>
        )} */}
        {/* CONTENT RENDERING */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-1">
          {activeView === "messages" && (
            <ActiveFrequencies
              conversations={conversations}
              onOpenChat={handleOpenChat}
              getOtherParticipant={getOtherParticipant}
            />
          )}

          {activeView === "notifications" && (
            <div className="h-full flex flex-col">
              <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onRead={handleNotificationClick}
                onReadAll={markAllAsRead}
                onRemove={removeNotification}
              />
            </div>
          )}

          {/* {activeView === "messages" && (
            <MessagesDropdown
              conversations={conversations}
              onOpenChat={handleOpenChat}
              getOtherParticipant={getOtherParticipant}
            />
          )} */}

          {activeView === "profile" && currentUser && (
            <ProfileDropdown
              user={currentUser}
              onLogout={() => authService.logout()}
            />
          )}
        </div>
      </div>

      {/* FOOTER */}
      {/* <div className="bg-surface-1 border-t-4 border-border p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-accent animate-pulse" />
          <span className="font-mono text-[7px] text-text-secondary uppercase tracking-widest">
            System_Ready
          </span>
        </div>
        <span className="font-mono text-[7px] text-text-secondary uppercase tracking-tighter italic">
          Sector_041_Comms
        </span>
      </div> */}
    </aside>
  );
};

const HeaderButton = ({ children, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-sm transition-all relative border-2 ${
      active
        ? "bg-accent text-background border-accent shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        : "bg-surface-1 border-border text-text-secondary hover:text-accent hover:border-border"
    }`}
  >
    {children}
    {badge > 0 && (
      <div className="absolute -top-1.5 -right-1.5 bg-error text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-surface-1">
        {badge}
      </div>
    )}
  </button>
);
