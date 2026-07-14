import { UserAvatarItem } from "@/components/ui/UserAvatarItem";
import {
  Bell,
  CheckCheck,
  User,
  Clock,
  Trash2,
  UserPlus,
  Heart,
  MessageSquare,
} from "lucide-react";

interface NotificationsDropdownProps {
  notifications: any[];
  unreadCount: number;
  onRead: (id: string) => void;
  onReadAll: () => void;
  onRemove: (id: string) => void;
}

export const NotificationsDropdown = ({
  notifications,
  unreadCount,
  onRead,
  onReadAll,
  onRemove,
}: NotificationsDropdownProps) => {
  // დამხმარე ფუნქცია დროის ფორმატირებისთვის
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log(notifications);

  // აიქონის შერჩევა ტიპის მიხედვით
  const getNotifIcon = (type: string) => {
    switch (type) {
      case "FOLLOW":
        return <UserPlus size={12} className="text-info" />;
      case "LIKE":
        return <Heart size={12} className="text-error" />;
      case "COMMENT":
        return <MessageSquare size={12} className="text-success" />;
      default:
        return <Bell size={12} className="text-accent" />;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="p-3 border-b-2 border-border bg-surface-1/80 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-accent" />
          <h3 className="font-black uppercase text-[10px] tracking-tighter text-text-primary">
            Incoming Signals ({unreadCount})
          </h3>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReadAll();
            }}
            className="text-[9px] text-accent uppercase font-black hover:text-accent flex items-center gap-1 transition-colors"
          >
            <CheckCheck size={12} /> Mark All
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-surface-1 overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[10px] font-mono text-text-primary uppercase italic">
              No signals detected
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onRead(notif)}
              className={`group relative p-3 border-b border-border transition-all duration-200 cursor-pointer flex gap-3 ${
                !notif.isRead
                  ? "bg-accent/5 hover:bg-primary-hover/10"
                  : "hover:bg-surface-1-hover/40"
              }`}
            >
              {/* Avatar & Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 border-2 border-border overflow-hidden bg-surface-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <UserAvatarItem
                    key={notif.sender}
                    user={notif.sender}
                    size="sm"
                    showName={false}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-surface-1 border border-border rounded-full flex items-center justify-center shadow-lg">
                  {getNotifIcon(notif.type)}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-[11px] leading-tight text-text-secondary">
                    <span className="font-black text-accent uppercase mr-1">
                      {notif.sender?.username || "System"}
                    </span>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)] flex-shrink-0 ml-2" />
                  )}
                </div>

                {notif.message && (
                  <p className="text-[10px] text-text-secondary line-clamp-1 italic mb-1 font-mono">
                    "{notif.message}"
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <Clock size={10} className="text-text-primary" />
                  <span className="text-[9px] font-mono text-text-primary">
                    {formatTime(notif.createdAt)}
                  </span>
                </div>
              </div>

              {/* Trash Action */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(notif.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-text-primary hover:text-error transition-all z-10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};
