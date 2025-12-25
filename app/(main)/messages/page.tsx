"use client";
import { useEffect, useState, useRef } from "react";
import {
  messagingService,
  Conversation,
  Message,
} from "@/services/messaging.service";
import { useSocket } from "@/hooks/useSocket";
import { Hash, Send, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null); // დავამატეთ სთეითი
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const searchParams = useSearchParams();
  const socket = useSocket(activeId || undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. პირველადი ჩატვირთვა (Sidebar)
  useEffect(() => {
    loadConversations();
  }, []);

  // 2. URL-იდან ID-ის აღება
  useEffect(() => {
    const idFromQuery = searchParams.get("id");
    if (idFromQuery) setActiveId(idFromQuery);
  }, [searchParams]);

  // 3. აქტიური საუბრის მართვა
  useEffect(() => {
    if (!activeId) return;

    const syncActiveConversation = async () => {
      // ვეძებთ Sidebar-ის სიაში
      const foundInList = conversations.find((c) => c.id === activeId);

      if (foundInList) {
        setActiveConv(foundInList);
      } else {
        // თუ სიაში არაა (ახალი შექმნილია), ბექენდიდან მოგვაქვს დეტალები
        try {
          const data = await messagingService.getConversationById(activeId);
          if (data) {
            setActiveConv(data);
            setConversations((prev) => [data, ...prev]); // Sidebar-ში ჩამატება
          }
        } catch (error) {
          console.error("ჩატის დეტალები ვერ ჩაიტვირთა", error);
        }
      }

      loadMessages(activeId);
      messagingService.markAsRead(activeId);
    };

    syncActiveConversation();
  }, [activeId, conversations.length]);

  // 4. Socket ლოგიკა
  useEffect(() => {
    if (!socket || !activeId) return;

    const handleNewMessage = (msg: Message) => {
      // ამოწმებს msg არსებობას და ეკუთვნის თუ არა ამ ჩატს
      if (msg && msg.conversationId === activeId) {
        setMessages((prev) => {
          // უსაფრთხო ძებნა მასივში
          const exists = prev.find((m) => m && m.id === msg.id);
          if (exists) return prev;

          return [...prev, msg];
        });

        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, activeId]);

  const loadConversations = async () => {
    const data = await messagingService.getConversations();
    setConversations(data || []);
  };

  const loadMessages = async (id: string) => {
    try {
      const data = await messagingService.getMessages(id);
      // დაცვა: თუ data undefined-ია, ვიყენებთ ცარიელ მასივს
      const msgs = Array.isArray(data) ? data : [];
      setMessages([...msgs].reverse());
    } catch (error) {
      console.error("მესიჯები ვერ ჩაიტვირთა", error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeId) return;
    const content = inputValue;
    setInputValue("");
    try {
      const newMsg = await messagingService.sendMessage({
        conversationId: activeId,
        content,
      });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("გაგზავნის შეცდომა", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-mono">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-7xl mx-auto h-[85vh] flex flex-col md:flex-row gap-4 relative z-10">
        {/* SIDEBAR */}
        <div className="w-full md:w-80 bg-neutral-900/50 border border-neutral-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 bg-black/40">
            <h2 className="text-orange-500 font-black italic uppercase tracking-tighter flex items-center gap-2">
              <Hash size={16} /> Active_Channels
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations?.map((conv) => {
              const user = conv.participants[0]?.user;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`p-4 border-b border-neutral-800/50 cursor-pointer transition-all hover:bg-orange-500/10 ${
                    activeId === conv.id
                      ? "bg-orange-500/20 border-r-4 border-r-orange-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 border border-neutral-700 bg-neutral-800">
                      <Image
                        src={user?.avatar?.url || "/default-avatar.png"}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase truncate block">
                        {user?.firstName}
                      </span>
                      <p className="text-[9px] text-neutral-500 truncate italic">
                        SECURE_LINK_ACTIVE
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 bg-neutral-900/30 border border-neutral-800 flex flex-col relative overflow-hidden">
          {activeConv ? (
            <>
              <div className="p-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-orange-500/50 overflow-hidden relative">
                    <Image
                      src={
                        activeConv.participants[0]?.user.avatar?.url ||
                        "/default-avatar.png"
                      }
                      alt="avatar"
                      fill
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1">
                      {activeConv.participants[0]?.user.firstName}{" "}
                      {activeConv.participants[0]?.user.lastName}
                      {activeConv.participants[0]?.user.isVerified && (
                        <ShieldCheck size={12} className="text-blue-500" />
                      )}
                    </h3>
                    <span className="text-[8px] text-green-500 animate-pulse">
                      ● ENCRYPTED
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => {
                  // 1. დაზღვევა: თუ msg რაიმე მიზეზით undefined-ია
                  if (!msg || !msg.id) return null;

                  // 2. ლოგიკა: "არის ჩემი?"
                  // ვიღებთ იმ ადამიანის ID-ს, ვისაც ვესაუბრებით
                  const otherUser = activeConv.participants.find(
                    (p) => p.userId !== msg.receiverId // ეს ლოგიკა ცოტა რთულია DIRECT ჩატში
                  );

                  // ყველაზე მარტივი და მუშა გზა:
                  // თუ senderId არ არის იმ იუზერის ID, ვისაც ვესაუბრებით, ესე იგი ჩემია.
                  const partner = activeConv.participants[0]; // DIRECT ჩატში მეორე იუზერია
                  const isMine = msg.senderId !== partner?.userId;

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 border transition-all ${
                          isMine
                            ? "bg-orange-500 text-black border-orange-400 font-bold skew-x-[-6deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-neutral-800 text-white border-neutral-700 font-light skew-x-[6deg]"
                        }`}
                      >
                        <div
                          className={
                            isMine ? "skew-x-[6deg]" : "skew-x-[-6deg]"
                          }
                        >
                          <p className="text-sm italic whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          <span
                            className={`text-[8px] block mt-1 opacity-50 ${
                              isMine ? "text-black" : "text-neutral-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-black/40 border-t border-neutral-800 flex gap-2"
              >
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="ENTER_DATA..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 px-4 py-2 text-xs text-orange-500 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-black px-4 py-2 font-black uppercase italic tracking-tighter skew-x-[-12deg]"
                >
                  SEND
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-600">
              <Hash size={48} className="mb-4 opacity-20" />
              <p className="text-[10px] uppercase tracking-[0.5em]">
                Waiting for transmission...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
