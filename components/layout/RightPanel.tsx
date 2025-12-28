"use client";

import { useEffect } from "react";
import { Activity, Wifi, Radio, Trophy, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { openChat } from "@/store/slices/floatingChatsSlice";
import { useConversations } from "@/hooks/useConversations";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";
import Image from "next/image";
import Link from "next/link";

export const RightPanel = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { conversations, loading, error } = useConversations();

  console.log(currentUser, "ddddddddddddddddddddddddd");

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

  if (loading) {
    return (
      <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-stone-500 text-sm">იტვირთება ჩატები...</p>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800 overflow-hidden">
      <div className="flex flex-col gap-6 p-4 overflow-y-auto custom-scrollbar h-full">
        {/* === შენი პროფილის ღილაკი ზევით === */}
        {currentUser && (
          <Link href={`/profile/${currentUser.username}`}>
            <div className="bg-[#1c1917] border-2 border-stone-800 p-2 hover:border-amber-600 transition-all cursor-pointer group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-stone-700 group-hover:border-amber-600 transition-colors">
                    <Image
                      src={currentUser.avatar?.url || "/default-avatar.png"}
                      alt={currentUser.username}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  {/* Online ინდიკატორი */}
                  <Circle
                    size={10}
                    className={cn(
                      "absolute bottom-0 right-0 fill-green-500 text-green-500 border-2 border-[#1c1917]",
                      currentUser.online ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm text-stone-200 uppercase tracking-tight group-hover:text-amber-500 transition-colors truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </h4>
                  <p className="text-xs text-orange-500 font-mono truncate">
                    @{currentUser.username}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Active Frequencies */}
        <div className="flex flex-col gap-3">
          <h3 className="font-black uppercase text-[10px] tracking-widest text-stone-500 flex items-center gap-2 px-1">
            <Radio size={14} className="text-amber-500" /> Active Frequencies
          </h3>

          {conversations.length === 0 ? (
            <p className="text-stone-600 text-xs text-center py-4">
              ჯერ არ გაქვთ აქტიური ჩატები
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const otherUser = getOtherParticipant(conv);
                const lastMessage = conv.messages?.[0];

                if (!otherUser) return null;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleOpenChat(conv)}
                    className="bg-[#1c1917] border-2 border-stone-800 p-3 hover:border-amber-600 transition-all cursor-pointer group shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-black text-stone-200 uppercase group-hover:text-amber-500 transition-colors">
                        {otherUser.username ||
                          `${otherUser.firstName} ${otherUser.lastName}`}
                      </h4>
                      <span className="text-[8px] font-mono text-stone-600">
                        {conv.id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle
                        size={6}
                        className={cn(
                          otherUser.online
                            ? "fill-green-500 text-green-500"
                            : "text-stone-700"
                        )}
                      />
                      <p className="text-[10px] font-mono text-stone-500 truncate uppercase tracking-tighter italic">
                        {lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-[#1c1917] border-2 border-stone-800 mt-auto">
          <div className="p-2 bg-stone-900/50 border-b-2 border-stone-800">
            <h3 className="font-black uppercase text-[9px] tracking-[0.2em] text-stone-400 flex items-center gap-2">
              <Trophy size={12} className="text-amber-500" /> Top Garages
            </h3>
          </div>
          <div className="p-2">
            <span className="text-[10px] font-mono text-stone-600 uppercase">
              Syncing Leaderboard...
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-2 opacity-20 border-t border-stone-900">
        <p className="text-[7px] font-mono text-stone-500 uppercase text-center tracking-tighter">
          Encrypted Social Layer // v1.0.4
        </p>
      </div>
    </aside>
  );
};
