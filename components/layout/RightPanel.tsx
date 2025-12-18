"use client";
import { useState } from "react";
import {
  Trophy,
  Flame,
  Activity,
  Gauge,
  Wifi,
  Zap,
  ChevronRight,
  Send,
  Paperclip,
  Radio,
  Hash,
  Search,
  Circle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const RightPanel = () => {
  const [activeChat, setActiveChat] = useState(null); // შენახული მეგობარი ჩატისთვის

  // მეგობრების იმიტირებული სია
  const friends = [
    {
      id: 1,
      name: "Dimitri Guntsadze",
      status: "online",
      lastMsg: "Transmission: I have the parts...",
      freq: "144.800 MHz",
    },
    {
      id: 2,
      name: "E30_Drifter",
      status: "offline",
      lastMsg: "See you at the meet",
      freq: "142.200 MHz",
    },
    {
      id: 3,
      name: "Turbo_Admin",
      status: "online",
      lastMsg: "Project approved.",
      freq: "148.500 MHz",
    },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-[#151413] border-l-4 border-stone-800 overflow-hidden">
      {/* თუ ჩატი არაა აქტიური, ვაჩვენებთ სტატისტიკას და მეგობრების სიას */}
      {!activeChat ? (
        <div className="flex flex-col gap-6 p-4 overflow-y-auto custom-scrollbar h-full">
          {/* Network Stats */}
          <div className="bg-[#1c1917] p-4 border-b-4 border-amber-600 shadow-xl overflow-hidden relative">
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
                <p className="text-[9px] text-stone-600 uppercase">
                  New Builds
                </p>
                <p className="text-xl font-bold text-stone-200 tracking-tighter">
                  14
                </p>
              </div>
            </div>
          </div>

          {/* Friends List (Comms List) */}
          <div className="flex flex-col gap-3">
            <h3 className="font-black uppercase text-[10px] tracking-widest text-stone-500 flex items-center gap-2 px-1">
              <Radio size={14} className="text-amber-500" /> Active Frequencies
              (Friends)
            </h3>
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setActiveChat(friend)}
                  className="bg-[#1c1917] border-2 border-stone-800 p-3 hover:border-amber-600 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-black text-stone-200 uppercase group-hover:text-amber-500 transition-colors">
                      {friend.name}
                    </h4>
                    <span className="text-[8px] font-mono text-stone-600">
                      {friend.freq}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle
                      size={6}
                      className={cn(
                        friend.status === "online"
                          ? "fill-green-500 text-green-500"
                          : "text-stone-700"
                      )}
                    />
                    <p className="text-[10px] font-mono text-stone-500 truncate uppercase tracking-tighter italic">
                      {friend.lastMsg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard - პატარა ვერსია */}
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
      ) : (
        /* აქტიური ჩატის ფანჯარა */
        <div className="flex flex-col h-full bg-[#11100f]">
          {/* Chat Header */}
          <div className="p-4 bg-[#1c1917] border-b-4 border-stone-800">
            <button
              onClick={() => setActiveChat(null)}
              className="flex items-center gap-2 text-stone-500 hover:text-amber-500 transition-colors mb-4 uppercase font-black text-[10px] tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Comms
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-900 border-2 border-stone-700 flex items-center justify-center text-amber-500">
                <Hash size={16} />
              </div>
              <div>
                <h3 className="text-stone-200 font-black uppercase text-xs tracking-widest leading-none">
                  {activeChat.name}
                </h3>
                <span className="text-[9px] font-mono text-green-500 uppercase">
                  Frequency: {activeChat.freq}
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            <div className="max-w-[90%] self-start">
              <p className="text-[8px] font-black text-stone-600 uppercase mb-1 tracking-widest">
                Incoming
              </p>
              <div className="bg-[#1c1917] p-3 border-2 border-stone-800 text-stone-300 font-mono text-[11px] relative">
                გამარჯობა, შენი BMW-ს დისკები კიდევ გაქვს?
              </div>
            </div>

            <div className="max-w-[90%] ml-auto">
              <p className="text-[8px] font-black text-amber-700 uppercase mb-1 text-right tracking-widest">
                Outgoing
              </p>
              <div className="bg-amber-600 p-3 border-2 border-amber-800 text-stone-900 font-bold text-[11px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                კი, ადგილზეა. 1200 ლარად ვატან.
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-[#1a1918] border-t-4 border-stone-800">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="TYPE COMMAND..."
                className="w-full bg-stone-900 border-2 border-stone-800 p-2 text-[11px] font-mono text-amber-500 focus:outline-none focus:border-amber-600"
              />
              <div className="flex gap-2">
                <button className="flex-1 bg-stone-200 text-stone-900 font-black uppercase tracking-widest text-[10px] py-2 border-b-4 border-stone-400 active:border-b-0 active:translate-y-1 transition-all">
                  Send Signal
                </button>
                <button className="p-2 bg-stone-800 border-2 border-stone-700 text-stone-500">
                  <Paperclip size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Info (ყოველთვის ბოლოშია) */}
      <div className="mt-auto p-2 opacity-20">
        <p className="text-[7px] font-mono text-stone-500 uppercase text-center tracking-tighter">
          Encrypted Social Layer // v1.0.4
        </p>
      </div>
    </aside>
  );
};
