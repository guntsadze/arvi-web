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

  return (
    <>
      {/* Header */}
      <div className="p-3 border-b-2 border-stone-800 bg-stone-900/80 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-amber-500" />
          <h3 className="font-black uppercase text-[10px] tracking-tighter text-stone-200">
            Incoming Signals ({unreadCount})
          </h3>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReadAll();
            }}
            className="text-[9px] text-amber-500 uppercase font-black hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <CheckCheck size={12} /> Mark All
          </button>
        )}
      </div>

      {/* List */}
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
              onClick={() => onRead(notif)}
              className={`group relative p-3 border-b border-stone-800 transition-all duration-200 cursor-pointer flex gap-3 ${
                !notif.isRead
                  ? "bg-amber-500/5 hover:bg-amber-500/10"
                  : "hover:bg-stone-800/40"
              }`}
            >
              {/* Avatar & Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 border-2 border-stone-800 overflow-hidden bg-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-[11px] leading-tight text-stone-300">
                    <span className="font-black text-amber-500 uppercase mr-1">
                      {notif.sender?.username || "System"}
                    </span>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)] flex-shrink-0 ml-2" />
                  )}
                </div>

                {notif.message && (
                  <p className="text-[10px] text-stone-500 line-clamp-1 italic mb-1 font-mono">
                    "{notif.message}"
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <Clock size={10} className="text-stone-600" />
                  <span className="text-[9px] font-mono text-stone-600">
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
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-stone-600 hover:text-red-500 transition-all z-10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <button className="w-full p-2.5 text-center text-[10px] font-black text-stone-500 bg-stone-900/50 border-t border-stone-800 hover:text-amber-500 transition-colors uppercase tracking-widest">
        View All System Logs
      </button>
    </>
  );
};
