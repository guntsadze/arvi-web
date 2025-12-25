"use client";

import { useEffect } from "react";
import { Activity, Wifi, Radio, Trophy, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { openChat } from "@/store/slices/floatingChatsSlice";
import { useConversations } from "@/hooks/useConversations"; // შეცვალე შენი path-ით
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/userSlice";

export const RightPanel = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { conversations, loading, error } = useConversations();

  // თუ loading — ლოუდერი, თუ error — შეცდომა
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

  // ვიღებთ მეორე მონაწილეს (რადგან 1x1 ჩატია)
  const getOtherParticipant = (conversation: any) => {
    return conversation.participants?.[0]?.user || null;
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

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800 overflow-hidden">
      <div className="flex flex-col gap-6 p-4 overflow-y-auto custom-scrollbar h-full">
        {/* Network Stats – დატოვე როგორც არის */}
        {/* <div className="bg-[#1c1917] p-4 border-b-4 border-amber-600 shadow-xl relative">
          <div className="absolute top-0 right-0 p-2">
            <Wifi size={12} className="text-green-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-amber-500 mb-4">
            <Activity size={16} />
            <span className="font-black uppercase tracking-[0.2em] text-[10px]">
              Telemetry Hub
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono">
            <div>
              <p className="text-[9px] text-stone-600 uppercase">
                Active Units
              </p>
              <p className="text-xl font-bold text-stone-200 tracking-tighter">
                1,248
              </p>
            </div>
            <div>
              <p className="text-[9px] text-stone-600 uppercase">New Builds</p>
              <p className="text-xl font-bold text-stone-200 tracking-tighter">
                14
              </p>
            </div>
          </div>
        </div> */}

        {/* Active Frequencies – ახლა რეალური ჩატებით */}
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
                const lastMessage = conv.messages?.[0]; // ბოლო მესიჯი (შენი სერვისი უკვე desc-ით აბრუნებს)

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
                        {conv.id.slice(0, 8)}...{" "}
                        {/* შეგიძლია სხვა "frequency" გამოიგონო, ან სერვერზე დაამატო ველი */}
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

        {/* Leaderboard – დატოვე როგორც გინდა */}
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

      <div className="mt-auto p-2 opacity-20">
        <p className="text-[7px] font-mono text-stone-500 uppercase text-center tracking-tighter">
          Encrypted Social Layer // v1.0.4
        </p>
      </div>
    </aside>
  );
};
